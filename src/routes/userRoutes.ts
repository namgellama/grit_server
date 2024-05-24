import express from "express";
import { getCurrentUser } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/currentUser").get(protect, getCurrentUser);

export default router;
