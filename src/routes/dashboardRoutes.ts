import express from "express";
import {
	getRevenue,
	getOrdersCount,
	getAverageOrderValue,
	getTop5MostSoldProduct,
} from "../controllers/dashboardController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/revenue").get(protect, admin, getRevenue);
router.route("/order").get(protect, admin, getOrdersCount);
router.route("/averageOrderValue").get(protect, admin, getAverageOrderValue);
router.route("/mostSold").get(protect, admin, getTop5MostSoldProduct);

export default router;
