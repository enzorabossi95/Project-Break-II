import { jest } from "@jest/globals";

// Mock del modelo Mongoose antes de importar el servicio
jest.unstable_mockModule("../../src/models/wishlist.model.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const { default: Wishlist } = await import("../../src/models/wishlist.model.js");
const { toggleProduct } = await import("../../src/services/wishlist.service.js");

describe("wishlist.service - toggleProduct", () => {
  test("crea una wishlist nueva si el usuario no tiene una", async () => {
    Wishlist.findOne.mockResolvedValue(null);
    Wishlist.create.mockResolvedValue({ userId: "u1", productIds: ["p1"] });

    const result = await toggleProduct("u1", "p1");

    expect(Wishlist.create).toHaveBeenCalledWith({ userId: "u1", productIds: ["p1"] });
    expect(result.productIds).toContain("p1");
  });

  test("agrega el producto si no está en la wishlist", async () => {
    const mockWishlist = { productIds: [], save: jest.fn() };
    Wishlist.findOne.mockResolvedValue(mockWishlist);

    const result = await toggleProduct("u1", "p2");

    expect(result.productIds).toContain("p2");
    expect(mockWishlist.save).toHaveBeenCalled();
  });

  test("elimina el producto si ya estaba en la wishlist", async () => {
    const mockWishlist = { productIds: ["p1", "p2"], save: jest.fn() };
    Wishlist.findOne.mockResolvedValue(mockWishlist);

    const result = await toggleProduct("u1", "p1");

    expect(result.productIds).not.toContain("p1");
    expect(mockWishlist.save).toHaveBeenCalled();
  });
});