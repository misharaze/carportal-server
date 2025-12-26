import { Router } from "express";
import * as controller from "../Controller/listingController.js";
import { auth, adminOnly } from "../Middleware/authMiddleware.js";
import { uploa } from "../Middleware/Uploa.js";

const router = Router();

// создание объявления (только авторизованный)
router.post("/", auth, uploa.single("image"), controller.createListing);

// список с пагинацией и фильтрами
router.get("/", controller.getListings);

router.post("/admin", auth, adminOnly, upload.single("image"), controller.createByAdmin);

// удаление (только админ)
router.delete("/:id", auth, adminOnly, controller.deleteListing);

router.get("/:id", controller.getOneListing);


export default router;