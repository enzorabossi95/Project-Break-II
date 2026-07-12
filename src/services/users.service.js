import prisma from "../config/prismaClient.js";

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true },
    // Nunca devolvemos passwordHash
  });
};