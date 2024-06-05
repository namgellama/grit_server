import express from "express";
import {
	createOrder,
	getMyOrder,
	getMyOrders,
	getOrders,
} from "../controllers/orderController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);
router.route("/mine").get(protect, getMyOrders);
router.route("/mine/:id").get(protect, getMyOrder);

export default router;
