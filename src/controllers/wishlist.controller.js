import * as wishlistService from "../services/wishlist.service.js";

export const getMyWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.userId);
    res.json({ ok: true, data: wishlist });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlistProduct = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.toggleProduct(req.user.userId, req.params.productId);
    res.json({ ok: true, data: wishlist });
  } catch (err) {
    next(err);
  }
};