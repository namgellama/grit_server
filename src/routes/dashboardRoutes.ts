import express from "express";
import {
	getRevenue,
	getOrdersCount,
	getAverageOrderValue,
} from "../controllers/dashboardController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/revenue").get(protect, admin, getRevenue);
router.route("/order").get(protect, admin, getOrdersCount);
router.route("/averageOrderValue").get(protect, admin, getAverageOrderValue);

export default router;
