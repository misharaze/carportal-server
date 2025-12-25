import { Router } from "express";
import { checkVinController } from "../Controller/VinController.js";

const router = Router();
router.get("/:vin", checkVinController);

export default router;
