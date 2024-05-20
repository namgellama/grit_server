import express from "express";
import {
	createOrder,
	getMyOrders,
	getOrders,
} from "../controllers/orderController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);
router.route("/mine").get(protect, getMyOrders);

export default router;
