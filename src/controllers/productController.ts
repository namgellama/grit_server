import { Product, Segment } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";
import { ProductRequestDTO } from "../types/product";

interface SearchParams {
	segment?: Segment;
	isNew?: boolean;
}

// @desc Get all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(
	async (request: Request<{}, {}, {}, SearchParams>, response: Response) => {
		const { segment: segmentParam, isNew } = request.query;
		const segments = Object.values(Segment);

		const segment = segments.find(
			(segment) => segment.toLowerCase() === segmentParam?.toLowerCase()
		);

		const products = await prisma.product.findMany({
			where: {
				segment,
				isNew,
			},
			include: {
				category: {
					select: {
						name: true,
					},
				},
				variants: true,
			},
		});

		response.status(200).json(products);
	}
);

// @desc Get a single product
// @route GET /api/products/:id
// @access Public
const getProduct = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const product = await prisma.product.findUnique({
			where: { id: String(request.params.id) },
			include: {
				category: {
					select: {
						name: true,
					},
				},
				variants: true,
			},
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
	async (request: Request<{}, {}, ProductRequestDTO>, response: Response) => {
		const {
			name,
			description,
			sellingPrice,
			crossedPrice,
			costPerItem,
			segment,
			isNew,
			categoryId,
			variants,
		} = request.body;
		const category = await prisma.category.findUnique({
			where: { id: String(categoryId) },
		});

		if (category) {
			const newProduct = await prisma.product.create({
				data: {
					name,
					description,
					sellingPrice,
					crossedPrice,
					costPerItem,
					segment,
					isNew,
					category: {
						connect: {
							id: categoryId!,
						},
					},

					variants: {
						create: variants.map((variant) => ({
							color: variant.color,
							image: variant.image,
							size: variant.size,
							stock: variant.stock,
						})),
					},
				},
				include: {
					variants: true,
				},
			});
			response.status(201).json(newProduct);
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
		const { name, description, sellingPrice, segment, categoryId } =
			request.body;
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
					description,
					sellingPrice,
					segment,
					category: {
						connect: {
							id: categoryId!,
						},
					},
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

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct };
