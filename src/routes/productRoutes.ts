import express from "express";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProductAdmin,
	getProducts,
	getProductsAdmin,
	updateProduct,
} from "../controllers/productController";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/admin").get(protect, admin, getProductsAdmin);
router
	.route("/:id")
	.get(getProduct)
	.put(protect, admin, updateProduct)
	.delete(protect, admin, deleteProduct);
router.route("/:id/admin").get(protect, admin, getProductAdmin);

export default router;
