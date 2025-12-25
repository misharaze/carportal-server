import Router from "express";
import { auth } from "../Middleware/authMiddleware.js";
import {
  toggleFavorite,
  getFavorites
} from "../Controller/FavoriteController.js";

const router = new Router();

router.post("/:listingId", auth, toggleFavorite);
router.get("/", auth, getFavorites);

export default router;
