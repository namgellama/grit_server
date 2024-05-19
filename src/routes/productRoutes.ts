import express from "express";
import { createProduct, getProducts } from "../controllers/productController";

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);

export default router;
