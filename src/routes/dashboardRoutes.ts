import express from "express";
import {
	getTop5MostSoldProduct,
	getRevenueByMonth,
	getKPIData,
} from "../controllers/dashboardController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/revenueByMonth").get(protect, admin, getRevenueByMonth);
router.route("/kpi").get(protect, admin, getKPIData);
router.route("/mostSold").get(protect, admin, getTop5MostSoldProduct);

export default router;
