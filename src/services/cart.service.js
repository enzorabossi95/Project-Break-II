import prisma from "../config/prismaClient.js";

export const getActiveCart = async (userId) => {
  let cart = await prisma.cart.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId, status: "ACTIVE" },
      include: { items: true },
    });
  }

  return cart;
};

export const addItemToCart = async (userId, productId, quantity) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  const cart = await getActiveCart(userId);

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
  });
};

export const removeItemFromCart = async (userId, itemId) => {
  const cart = await getActiveCart(userId);

  const item = cart.items.find((i) => i.id === itemId);

  if (!item) {
    return null;
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return item;
};

export const checkout = async (userId) => {
  const cart = await getActiveCart(userId);

  if (cart.items.length === 0) {
    const error = new Error("El carrito está vacío");
    error.status = 400;
    throw error;
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  let total = 0;
  const orderItemsData = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const priceAtPurchase = product.price;
    total += priceAtPurchase * item.quantity;

    return {
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase,
    };
  });

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    await tx.cart.update({
      where: { id: cart.id },
      data: { status: "CHECKED_OUT" },
    });

    return newOrder;
  });

  return order;
};