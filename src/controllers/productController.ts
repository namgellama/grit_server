import { Segment } from "@prisma/client";
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
			select: {
				id: true,
				name: true,
				description: true,
				sellingPrice: true,
				crossedPrice: true,
				segment: true,
				isNew: true,
				createdAt: true,
				updatedAt: true,
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

// @desc Get all products
// @route GET /api/products/admin
// @access Private / Admin
const getProductsAdmin = asyncHandler(
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
			where: { id: request.params.id },
			select: {
				id: true,
				name: true,
				description: true,
				sellingPrice: true,
				crossedPrice: true,
				segment: true,
				isNew: true,
				createdAt: true,
				updatedAt: true,
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

// @desc Get a single product
// @route GET /api/products/:id/admin
// @access Private / Admin
const getProductAdmin = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const product = await prisma.product.findUnique({
			where: { id: request.params.id },
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
		const { categoryId, variants } = request.body;
		const category = await prisma.category.findUnique({
			where: { id: String(categoryId) },
		});

		if (category) {
			const newProduct = await prisma.product.create({
				data: {
					...request.body,
					variants: {
						create: variants.map((variant) => ({
							color: variant.color,
							hexColor: variant.hexColor,
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
		request: Request<{ id: string }, {}, ProductRequestDTO>,
		response: Response
	) => {
		const { categoryId, variants } = request.body;

		const product = await prisma.product.findUnique({
			where: { id: request.params.id },
		});
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

		if (product && category) {
			const product = await prisma.product.update({
				where: {
					id: request.params.id,
				},
				data: {
					...request.body,
					variants: {
						deleteMany: {
							productId: request.params.id,
						},
						create: variants.map((variant) => ({
							color: variant.color,
							hexColor: variant.hexColor,
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
			where: { id: request.params.id },
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

export {
	createProduct,
	deleteProduct,
	getProduct,
	getProductAdmin,
	getProducts,
	getProductsAdmin,
	updateProduct,
};
