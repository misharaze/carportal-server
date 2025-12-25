import jwt from "jsonwebtoken";
import db from "../Models/index.js";

const { User } = db;

export default async function adminMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Нет токена" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Нет токена" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Нет прав администратора" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("ADMIN MIDDLEWARE ERROR:", e);
    return res.status(401).json({ error: "Недействительный токен" });
  }
}