export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: { message: "No tenés permisos para esta acción" } });
    }
    next();
  };
};