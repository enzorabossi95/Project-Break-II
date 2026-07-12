import * as productService from "../services/products.service.js";

export const listProducts = async (req, res, next) => {
  try {
    const data = await productService.getAllProducts();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ ok: false, error: { message: "Product not found" } });
    }

    res.json({ ok: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({ ok: true, data: newProduct });
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ ok: false, error: { message: "Product not found" } });
    }

    res.json({ ok: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(404).json({ ok: false, error: { message: "Product not found" } });
    }

    res.json({ ok: true, data: deleted });
  } catch (err) {
    next(err);
  }
};