export const validateProduct = (req, res, next) => {
  // con multipart/form-data (subida de imagen) los numéricos llegan como string
  if (typeof req.body.price === "string" && req.body.price !== "") {
    const parsed = Number(req.body.price);
    if (!Number.isNaN(parsed)) req.body.price = parsed;
  }

  if (typeof req.body.stock === "string" && req.body.stock !== "") {
    const parsed = Number(req.body.stock);
    if (!Number.isNaN(parsed)) req.body.stock = parsed;
  }

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