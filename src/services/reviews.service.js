import Review from "../models/review.model.js";

export const getReviewsByProduct = async (productId) => {
  return Review.find({ productId });
};

export const createReview = async (productId, userId, data) => {
  const review = await Review.create({
    productId,
    userId,
    rating: data.rating,
    comment: data.comment,
  });
  return review;
};