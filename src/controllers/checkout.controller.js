import stripe from "../config/stripe.js";
import prisma from "../config/prismaClient.js";
import * as cartService from "../services/cart.service.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const cart = await cartService.getActiveCart(req.user.userId);

    if (cart.items.length === 0) {
      return res.status(400).json({ ok: false, error: { message: "El carrito está vacío" } });
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    const line_items = cart.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ ok: true, data: { url: session.url } });
  } catch (err) {
    next(err);
  }
};

export const confirmCheckoutSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ ok: false, error: { message: "El campo 'sessionId' es obligatorio" } });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ ok: false, error: { message: "El pago no se completó" } });
    }

    // recién con el pago confirmado por Stripe es seguro registrar la compra
    const order = await cartService.checkout(req.user.userId);
    res.status(201).json({ ok: true, data: order });
  } catch (err) {
    next(err);
  }
};
