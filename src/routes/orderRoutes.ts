import express from "express";
import { createOrder } from "../controllers/orderController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(protect, createOrder);

export default router;
