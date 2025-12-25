import { Router } from "express";
import { checkVinController } from "../Controller/vinController.js";

const router = Router();
router.get("/:vin", checkVinController);

export default router;
