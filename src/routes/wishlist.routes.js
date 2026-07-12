import express from "express";
import { getMyWishlist, toggleWishlistProduct } from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Ver la wishlist del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos favoritos
 */
router.get("/", authenticate, getMyWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   post:
 *     summary: Añadir o quitar un producto de la wishlist (toggle)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist actualizada
 */
router.post("/:productId", authenticate, toggleWishlistProduct);

export default router;