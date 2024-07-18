import express from "express";
import { getSearchedProducts } from "../controllers/searchController";

const router = express.Router();

router.route("/").get(getSearchedProducts);

export default router;
