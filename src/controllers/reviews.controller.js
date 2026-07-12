import * as reviewsService from "../services/reviews.service.js";

export const listReviews = async (req, res, next) => {
  try {
    const reviews = await reviewsService.getReviewsByProduct(req.params.id);
    res.json({ ok: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (rating === undefined || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: { message: "El campo 'rating' debe ser un número entre 1 y 5" } });
    }

    const review = await reviewsService.createReview(req.params.id, req.user.userId, { rating, comment });
    res.status(201).json({ ok: true, data: review });
  } catch (err) {
    next(err);
  }
};