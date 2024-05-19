import express from "express";
import {
	createCategory,
	getCategories,
	getCategory,
	updateCategory,
} from "../controllers/categoryController";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").get(getCategory).put(updateCategory);

export default router;
