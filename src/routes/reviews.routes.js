import express from "express";
import { listReviews, addReview } from "../controllers/reviews.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   get:
 *     summary: Listar reviews de un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de reviews
 */
router.get("/", listReviews);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Crear una review para un producto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review creada
 *       400:
 *         description: Rating inválido
 */
router.post("/", authenticate, addReview);

export default router;