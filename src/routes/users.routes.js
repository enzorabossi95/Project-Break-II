import express from "express";
import { getProfile } from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *       401:
 *         description: Token requerido o inválido
 */
router.get("/profile", authenticate, getProfile);

export default router;