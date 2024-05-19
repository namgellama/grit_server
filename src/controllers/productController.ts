import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { Product } from "@prisma/client";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(
	async (request: Request, response: Response) => {
		const products = await prisma.product.findMany();
		response.json(products);
	}
);

// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(
	async (request: Request<{}, {}, Product>, response: Response) => {
		const {
			name,
			color,
			description,
			image,
			price,
			segment,
			categoryId,
			stock,
			sizes,
		} = request.body;
		const categoryExist = await prisma.category.findUnique({
			where: { id: String(categoryId) },
		});

		if (!categoryExist)
			return response
				.status(404)
				.send("Category with that Id not found.");

		const products = await prisma.product.create({
			data: {
				name,
				color: JSON.stringify(color),
				description,
				image,
				price,
				segment,
				category: {
					connect: {
						id: categoryId!,
					},
				},
				stock,
				sizes,
			},
		});
		response.json(products);
	}
);

export { getProducts, createProduct };
