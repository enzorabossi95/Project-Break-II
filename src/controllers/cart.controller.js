import * as cartService from "../services/cart.service.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getActiveCart(req.user.userId);
    res.json({ ok: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ ok: false, error: { message: "El campo 'productId' es obligatorio" } });
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ ok: false, error: { message: "El campo 'quantity' debe ser un número mayor a 0" } });
    }

    const item = await cartService.addItemToCart(req.user.userId, productId, quantity);
    res.status(201).json({ ok: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const deleted = await cartService.removeItemFromCart(req.user.userId, req.params.itemId);

    if (!deleted) {
      return res.status(404).json({ ok: false, error: { message: "Item no encontrado en el carrito" } });
    }

    res.json({ ok: true, data: deleted });
  } catch (err) {
    next(err);
  }
};

export const checkoutCart = async (req, res, next) => {
  try {
    const order = await cartService.checkout(req.user.userId);
    res.status(201).json({ ok: true, data: order });
  } catch (err) {
    next(err);
  }
};