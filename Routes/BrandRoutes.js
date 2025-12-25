import { Router } from "express";
import { getBrandsFromListings } from "../Controller/BrandController.js";

const router = Router();

router.get("/", getBrandsFromListings);

export default router;
