import { Router } from "express";
import { auth, adminOnly } from "../Middleware/authMiddleware.js";
import { getSettings, updateSettings } from "../Controller/SettingsController.js";

const router = Router();

router.get("/", auth, adminOnly, getSettings);
router.put("/", auth, adminOnly, updateSettings);

export default router;
