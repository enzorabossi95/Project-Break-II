import Wishlist from "../models/wishlist.model.js";

export const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId });
  return wishlist || { userId, productIds: [] };
};

export const toggleProduct = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [productId] });
    return wishlist;
  }

  const index = wishlist.productIds.indexOf(productId);

  if (index === -1) {
    wishlist.productIds.push(productId);
  } else {
    wishlist.productIds.splice(index, 1);
  }

  await wishlist.save();
  return wishlist;
};