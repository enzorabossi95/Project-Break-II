import * as authService from "../services/auth.service.js";

const isProd = process.env.NODE_ENV === "production";

// en producción, frontend (Netlify) y backend (Render) están en dominios distintos:
// la cookie cross-site necesita sameSite "none" + secure, o el navegador no la manda
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

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

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días, igual que JWT_EXPIRES_IN por defecto
    });

    res.json({
      ok: true,
      data: { user: { id: user.id, email: user.email, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ ok: true, message: "Logged out" });
};