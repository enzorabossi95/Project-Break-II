import { logAdminAction } from "../services/adminLog.service.js";

export const adminLogger = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await logAdminAction(req.user.userId, action, req.originalUrl);
      }
    } catch (err) {
      console.error("Error registrando acción de admin:", err.message);
    }
    next();
  };
};