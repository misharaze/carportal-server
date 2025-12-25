import { Router } from "express";
import { register, login,verify2FA } from "../Controller/authController.js";
import PasswordController from "../Controller/PasswordController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-2fa", verify2FA);

// 🔐 FORGOT / RESET
router.post("/forgot-password", PasswordController.forgot);
router.post("/reset-password", PasswordController.reset);

export default router;
