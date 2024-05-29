import express from "express";
import { createBagItem } from "../controllers/bagItemController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(protect, createBagItem);

export default router;
