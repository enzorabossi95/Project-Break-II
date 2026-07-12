export const validateProduct = (req, res, next) => {
  const { name, price } = req.body;

  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ ok: false, error: { message: "El campo 'name' debe ser un string" } });
  }

  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    return res.status(400).json({ ok: false, error: { message: "El campo 'price' debe ser un número >= 0" } });
  }

  if (req.method === "POST") {
    if (!name) {
      return res.status(400).json({ ok: false, error: { message: "El campo 'name' es obligatorio" } });
    }
    if (price === undefined) {
      return res.status(400).json({ ok: false, error: { message: "El campo 'price' es obligatorio" } });
    }
  }

  next();
};