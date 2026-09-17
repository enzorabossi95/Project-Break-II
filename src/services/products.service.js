import prisma from "../config/prismaClient.js";

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({ where: { id } });
};

export const createProduct = async (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      category: data.category || null,
      description: data.description || null,
      price: data.price,
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl || null,
    },
  });
};

export const updateProduct = async (id, data) => {
  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (err) {
    if (err.code === "P2025") return null;
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (err.code === "P2025") return null;
    throw err;
  }
};