import { Router } from "express";
import { auth, adminOnly } from "../Middleware/authMiddleware.js";
import { uploa } from "../Middleware/Uploa.js";

import {
  adminGetListings,
  deleteListing,
  adminUpdateStatus,
  adminUpdateListing,
  createByAdmin,
  bulkCreateListings
} from "../Controller/listingController.js";

import {
  getUsers,
  updateUserRole,
  toggleBan,
  deleteUser
} from "../Controller/AdminUserController.js";

import { getAdminStats } from "../Controller/StatsController.js";

const router = Router();

// 🔐 ТОЛЬКО АДМИН
router.use(auth, adminOnly);

/* ===== LISTINGS ===== */
router.get("/listings", adminGetListings);
router.patch("/listings/:id/status", adminUpdateStatus);
router.patch("/listings/:id", adminUpdateListing);
router.post("/listings", createByAdmin);
router.post("/listings/bulk", bulkCreateListings);
router.delete("/listings/:id", deleteListing);


/* ===== USERS ===== */
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/ban", toggleBan);
router.delete("/users/:id", deleteUser);
router.post("/listings", uploa.single("image"), createByAdmin);
/* ===== STATS ===== */
router.get("/stats", getAdminStats);

export default router;
