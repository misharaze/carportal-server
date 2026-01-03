import { Router } from "express";
import { auth } from "../Middleware/authMiddleware.js";

import {
  createMessage,
  getConversations,
  getMessages,
  markAsRead,
  startConversation
} from "../Controller/MessageController.js";

const router = Router();

router.post("/", auth, createMessage);
router.get("/conversations", auth, getConversations);
router.get("/:id", auth, getMessages);
router.patch("/:id/read", auth, markAsRead);
router.post("/messages/start", auth, startConversation);

export default router;
