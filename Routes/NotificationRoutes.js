import { Router } from "express";
import { auth } from "../Middleware/authMiddleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  clearNotifications
} from "../Controller/NotificationController.js";

const router = Router();

router.get("/", auth, getNotifications);
router.get("/count", auth, getUnreadCount);
router.patch("/:id/read", auth, markAsRead);
router.delete("/clear", auth, clearNotifications);

export default router;
