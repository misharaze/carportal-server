import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import db from "./Models/index.js";
import authRoutes from "./Routes/AuthRoutes.js";
import listingRoutes from "./Routes/ListingsRoutes.js";
import { apiLimiter } from "./Middleware/rateLimit.js";
import adminRoutes from "./Routes/AdminRoutes.js"
import vinRoutes from "./Routes/VinRoutes.js"
import FavoriteRoutes from './Routes/FavoritesRoutes.js';
import BrandRoutes from "./Routes/BrandRoutes.js";
import notificationRoutes from "./Routes/NotificationRoutes.js";
import searchRoutes from "./Routes/SearchRoutes.js";
import userRoutes from  "./Routes/UserRoutes.js"


const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
)
app.use(cors({
  origin:[ "http://localhost:3000",
   "http://localhost:3002",
    "https://carportalclient.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", FavoriteRoutes);
app.use("/api/brands", BrandRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("uploads"));


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5001;

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({alter:false});
    console.log("✅ БД подключена");

    
    app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
  } catch (e) {
    console.error("❌ Ошибка запуска:", e);
  
  }
};

start();
