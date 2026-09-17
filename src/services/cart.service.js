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
  const requestedQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (requestedQuantity > product.stock) {
    const error = new Error(`Stock insuficiente: quedan ${product.stock} unidades de "${product.name}"`);
    error.status = 400;
    throw error;
  }

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: requestedQuantity },
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
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error("El carrito está vacío");
      error.status = 400;
      throw error;
    }

    // claim atómico: solo marca CHECKED_OUT si seguía ACTIVE, evita doble orden en carreras
    const claimed = await tx.cart.updateMany({
      where: { id: cart.id, status: "ACTIVE" },
      data: { status: "CHECKED_OUT" },
    });

    if (claimed.count === 0) {
      const error = new Error("Esta compra ya fue confirmada");
      error.status = 409;
      throw error;
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });

    let total = 0;
    const orderItemsData = [];

    for (const item of cart.items) {
      const product = products.find((p) => p.id === item.productId);

      // mismo patrón de claim atómico que arriba, ahora sobre el stock
      const stockUpdate = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });

      if (stockUpdate.count === 0) {
        const error = new Error(`Stock insuficiente para "${product.name}"`);
        error.status = 409;
        throw error;
      }

      const priceAtPurchase = product.price;
      total += priceAtPurchase * item.quantity;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase,
      });
    }

    return tx.order.create({
      data: {
        userId,
        total,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });
  });
};