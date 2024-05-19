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

// @desc Fetch a single product
// @route GET /api/products/:id
// @access Public
const getProduct = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const product = await prisma.product.findUnique({
			where: { id: String(request.params.id) },
		});

		if (!product)
			return response.status(404).send("Product with that Id not found.");

		response.json(product);
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

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(
	async (
		request: Request<{ id: string }, {}, Product>,
		response: Response
	) => {
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
		const productExist = await prisma.product.findUnique({
			where: { id: String(request.params.id) },
		});

		if (!productExist)
			return response.status(404).send("Product with that Id not found.");

		const categoryExist = await prisma.category.findUnique({
			where: { id: String(categoryId) },
		});

		if (!categoryExist)
			return response
				.status(404)
				.send("Category with that Id not found.");

		const products = await prisma.product.update({
			where: {
				id: request.params.id,
			},
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

export { getProducts, getProduct, createProduct, updateProduct };
