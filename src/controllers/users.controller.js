import * as usersService from "../services/users.service.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ ok: false, error: { message: "Usuario no encontrado" } });
    }

    res.json({ ok: true, data: user });
  } catch (err) {
    next(err);
  }
};