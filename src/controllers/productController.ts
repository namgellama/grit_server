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
		response.status(200).json(products);
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

		if (product) response.status(200).json(product);
		else {
			response.status(404);
			throw new Error("Product not found");
		}
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
		const category = await prisma.category.findUnique({
			where: { id: String(categoryId) },
		});

		if (category) {
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
			response.status(201).json(products);
		} else {
			response.status(404);
			throw new Error("Category not found");
		}
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
		const product = await prisma.product.findUnique({
			where: { id: String(request.params.id) },
		});
		const category = await prisma.category.findUnique({
			where: { id: String(categoryId) },
		});

		if (product && category) {
			const product = await prisma.product.update({
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
			response.status(200).json(product);
		} else {
			response.status(404);
			throw new Error("Resource not found");
		}
	}
);

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const product = await prisma.product.findUnique({
			where: { id: String(request.params.id) },
		});

		if (product) {
			await prisma.product.delete({ where: { id: request.params.id } });

			response.sendStatus(204);
		} else {
			response.status(404);
			throw new Error("Product not found");
		}
	}
);

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
