import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,             // 300 запросов за 15 минут
  standardHeaders: true,
  legacyHeaders: false
});
