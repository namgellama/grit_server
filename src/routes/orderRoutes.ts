import express from "express";
import { createOrder, getOrders } from "../controllers/orderController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);

export default router;
