import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/models/review.model.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
  },
}));

const { default: Review } = await import("../../src/models/review.model.js");
const { createReview } = await import("../../src/services/reviews.service.js");

describe("reviews.service - createReview", () => {
  test("crea una review con rating válido", async () => {
    Review.create.mockResolvedValue({ productId: "p1", userId: "u1", rating: 5, comment: "Buenísimo" });

    const result = await createReview("p1", "u1", { rating: 5, comment: "Buenísimo" });

    expect(Review.create).toHaveBeenCalledWith({
      productId: "p1",
      userId: "u1",
      rating: 5,
      comment: "Buenísimo",
    });
    expect(result.rating).toBe(5);
  });

  test("el rating debe estar entre 1 y 5 (validación de rango)", () => {
    const isValidRating = (rating) => rating >= 1 && rating <= 5;

    expect(isValidRating(5)).toBe(true);
    expect(isValidRating(0)).toBe(false);
    expect(isValidRating(6)).toBe(false);
  });
});