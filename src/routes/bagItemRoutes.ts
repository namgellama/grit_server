import express from "express";
import {
	createBagItem,
	deleteBagItem,
	getBagItems,
	updateBagItem,
} from "../controllers/bagItemController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router
	.route("/")
	.get(protect, getBagItems)
	.post(protect, createBagItem)
	.delete(protect, deleteBagItem);
router
	.route("/:id")
	.patch(protect, updateBagItem)
	.delete(protect, deleteBagItem);

export default router;
