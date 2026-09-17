import express from "express";
import { createCheckoutSession, confirmCheckoutSession } from "../controllers/checkout.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * /api/checkout/session:
 *   post:
 *     summary: Crear una sesión de pago de Stripe a partir del carrito activo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URL de la sesión de pago de Stripe
 */
router.post("/session", authenticate, createCheckoutSession);

/**
 * @swagger
 * /api/checkout/confirm:
 *   post:
 *     summary: Verificar el pago con Stripe y confirmar el pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado tras confirmar el pago
 *       400:
 *         description: Pago no completado o carrito vacío
 */
router.post("/confirm", authenticate, confirmCheckoutSession);

export default router;
