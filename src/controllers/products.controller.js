import * as productService from "../services/products.service.js";
import cloudinary from "../config/cloudinary.js";

const uploadImageBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

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
    const payload = { ...req.body };

    if (req.file) {
      const uploadResult = await uploadImageBuffer(req.file.buffer);
      payload.imageUrl = uploadResult.secure_url;
    }

    const newProduct = await productService.createProduct(payload);
    res.status(201).json({ ok: true, data: newProduct });
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // Sin archivo nuevo, no tocamos imageUrl: se conserva la imagen ya guardada.
    if (req.file) {
      const uploadResult = await uploadImageBuffer(req.file.buffer);
      payload.imageUrl = uploadResult.secure_url;
    }

    const updated = await productService.updateProduct(req.params.id, payload);

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