import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import db from "./Models/index.js";
import { auth } from "./Middleware/authMiddleware.js";
import maintenanceMiddleware from "./Middleware/maintenanceMiddleware.js";

/* ROUTES */
import authRoutes from "./Routes/AuthRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";
import listingRoutes from "./Routes/ListingsRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import settingsRoutes from "./Routes/SettingsRoutes.js";
import FavoriteRoutes from "./Routes/FavoritesRoutes.js";
import BrandRoutes from "./Routes/BrandRoutes.js";
import searchRoutes from "./Routes/SearchRoutes.js";
import notificationRoutes from "./Routes/NotificationRoutes.js";
import messageRoutes from "./Routes/Messages.js";
const app = express();

/* ================= BASIC MIDDLEWARE ================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(compression());
app.use(morgan("dev"));

/* ================= PUBLIC ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/brands", BrandRoutes);
app.use("/api/search", searchRoutes);

// 🔥 ПУБЛИЧНЫЙ просмотр объявлений
app.use("/api/listings", listingRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

/* ================= AUTH MIDDLEWARE ================= */
app.use(auth);

/* ================= MAINTENANCE MODE ================= */
app.use(maintenanceMiddleware);

/* ================= PROTECTED ROUTES ================= */
app.use("/api/user", userRoutes);
app.use("/api/favorites", FavoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
/* ================= ADMIN ================= */
app.use("/api/admin", adminRoutes);
app.use("/api/admin/settings", settingsRoutes);

/* ================= STATIC ================= */
app.use("/uploads", express.static("uploads"));

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5001;

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: false });

    console.log("✅ База подключена");
    app.listen(PORT, () =>
      console.log(`🚀 Сервер запущен на ${PORT}`)
    );
  } catch (e) {
    console.error("❌ Ошибка запуска:", e);
  }
};

start();
