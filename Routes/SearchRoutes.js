import Router from "express";
import SearchController from "../Controller/SearchController.js";

const router = new Router();

router.get("/", SearchController.search);

export default router;
