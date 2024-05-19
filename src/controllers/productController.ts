import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(
	async (request: Request, response: Response) => {
		const products = await prisma.product.findMany();
		response.json(products);
	}
);

export { getProducts };
