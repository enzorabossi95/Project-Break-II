import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ ok: false, error: { message: "El campo 'email' es obligatorio" } });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ ok: false, error: { message: "El campo 'password' es obligatorio (mínimo 6 caracteres)" } });
    }

    const user = await authService.registerUser(email, password);

    res.status(201).json({
      ok: true,
      data: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: { message: "Email y password son obligatorios" } });
    }

    const { token, user } = await authService.loginUser(email, password);

    res.json({
      ok: true,
      data: { token, user: { id: user.id, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};