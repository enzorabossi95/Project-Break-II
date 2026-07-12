export const notFound = (req, res) => {
  res.status(404).json({ ok: false, error: { message: "Ruta no encontrada" } });
};