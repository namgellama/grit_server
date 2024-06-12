import express from "express";
import { admin, protect } from "../middlewares/authMiddleware";
import { updatePayment } from "../controllers/paymentController";

const router = express.Router();

router.route("/:id").patch(protect, admin, updatePayment);

export default router;
