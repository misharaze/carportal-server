import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import db from "./Models/index.js";
import { auth } from "./Middleware/authMiddleware.js";
import maintenanceMiddleware from "./Middleware/maintenanceMiddleware.js";

import authRoutes from "./Routes/AuthRoutes.js";
import userRoutes from "./Routes/UserRoutes.js";
import listingRoutes from "./Routes/ListingsRoutes.js";
import adminRoutes from "./Routes/AdminRoutes.js";
import settingsRoutes from "./Routes/SettingsRoutes.js";
import FavoriteRoutes from "./Routes/FavoritesRoutes.js";
import BrandRoutes from "./Routes/BrandRoutes.js";
import searchRoutes from "./Routes/SearchRoutes.js";
import notificationRoutes from "./Routes/NotificationRoutes.js";

const app = express();


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


app.use("/api/auth", authRoutes);
app.use("/api/brands", BrandRoutes);
app.use("/api/search", searchRoutes);
app.use("/health", (_, res) => res.json({ status: "ok" }));


app.use(auth);


app.use(maintenanceMiddleware);



app.use("/api/user", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/favorites", FavoriteRoutes);
app.use("/api/notifications", notificationRoutes);

/* ADMIN */
app.use("/api/admin", adminRoutes);
app.use("/api/admin/settings", settingsRoutes);

app.use("/uploads", express.static("uploads"));



const PORT = process.env.PORT || 5001;

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: false });

    console.log("✅ БД подключена");
    app.listen(PORT, () =>
      console.log(`✅ Сервер запущен на порту ${PORT}`)
    );
  } catch (e) {
    console.error("❌ Ошибка запуска:", e);
  }
};

start();
