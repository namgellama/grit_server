import express from "express";
import { getMyLastOrderAddress } from "../controllers/addressController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/mine").get(protect, getMyLastOrderAddress);

export default router;
