import db from "../Models/index.js";

const { Settings } = db;

export default async function maintenanceMiddleware(req, res, next) {
  try {
    const settings = await Settings.findOne();

    // если настроек нет — пропускаем
    if (!settings) return next();

    // если режим обслуживания выключен
    if (!settings.maintenance) return next();

    // если пользователь админ — пускаем
    if (req.user?.role === "admin") return next();

    return res.status(503).json({
      error: "Сайт находится на техническом обслуживании"
    });
  } catch (err) {
    console.error("MAINTENANCE MIDDLEWARE ERROR:", err);
    next(); // не ломаем сайт
  }
}
