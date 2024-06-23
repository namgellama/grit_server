import express from "express";
import {
	getKPIData,
	getRevenueByMonth,
	getMostSoldProducts,
} from "../controllers/dashboardController";
import { admin, protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/revenueByMonth").get(protect, admin, getRevenueByMonth);
router.route("/kpi").get(protect, admin, getKPIData);
router.route("/mostSoldProducts").get(protect, admin, getMostSoldProducts);

export default router;
