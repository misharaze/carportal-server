import { Router } from "express";
import { auth, adminOnly } from "../Middleware/authMiddleware.js";
import { upload } from "../Middleware/Uploa.js";

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

/* ===== защита ===== */
router.use(auth, adminOnly);

/* ===== LISTINGS ===== */
router.get("/listings", adminGetListings);

router.post(
  "/listings",
  upload.single("image"),
  createByAdmin
);

router.post(
  "/listings/bulk",
  bulkCreateListings
);

router.patch(
  "/listings/:id",
  upload.single("image"),
  adminUpdateListing
);

router.patch(
  "/listings/:id/status",
  adminUpdateStatus
);

router.delete(
  "/listings/:id",
  deleteListing
);

/* ===== USERS ===== */
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/ban", toggleBan);
router.delete("/users/:id", deleteUser);

/* ===== STATS ===== */
router.get("/stats", getAdminStats);

export default router;
