import express from "express";
import {
	createBagItem,
	getBagItems,
	updateBagItem,
} from "../controllers/bagItemController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getBagItems).post(protect, createBagItem);
router.route("/:id").patch(protect, updateBagItem);

export default router;
