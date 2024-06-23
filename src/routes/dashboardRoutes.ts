import express from "express";
import {
	getKPIData,
	getRevenueByMonth,
	getTop5MostSoldProduct,
} from "../controllers/dashboardController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/revenueByMonth").get(protect, admin, getRevenueByMonth);
router.route("/kpi").get(protect, admin, getKPIData);
router
	.route("/top5MostSoldProducts")
	.get(protect, admin, getTop5MostSoldProduct);

export default router;
