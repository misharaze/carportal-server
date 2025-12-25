import Router from "express";
import ProfilController from "../Controller/ProfilController.js";
import { auth } from "../Middleware/authMiddleware.js";

import { avatarUpload } from "../Middleware/avatarUpload.js";

const router = new Router();

router.get("/profile", auth, ProfilController.getProfile);
router.put("/profile", auth, ProfilController.updateProfile);

router.post(
  "/avatar",
  auth,
  avatarUpload.single("avatar"),
  ProfilController.uploadAvatar
);

export default router;
