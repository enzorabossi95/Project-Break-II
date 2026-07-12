import express from "express";
import { getCart, addItem, removeItem, checkoutCart } from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener el carrito activo del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito activo con sus items
 */
router.get("/", authenticate, getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Añadir un producto al carrito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto añadido al carrito
 */
router.post("/items", authenticate, addItem);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 */
router.delete("/items/:itemId", authenticate, removeItem);

/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     summary: Confirmar la compra y generar un pedido
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 */
router.post("/checkout", authenticate, checkoutCart);

export default router;