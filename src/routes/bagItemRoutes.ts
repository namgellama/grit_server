import express from "express";
import { createBagItem, getBagItems } from "../controllers/bagItemController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getBagItems).post(protect, createBagItem);

export default router;
