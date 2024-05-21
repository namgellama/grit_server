import { Category } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";

// @desc Get all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(
	async (request: Request, response: Response) => {
		const categories = await prisma.category.findMany();
		response.status(200).json(categories);
	}
);

// @desc Get a single category
// @route GET /api/categories/:id
// @access Public
const getCategory = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const category = await prisma.category.findUnique({
			where: { id: String(request.params.id) },
		});

		if (category) response.status(200).json(category);
		else {
			response.status(404);
			throw new Error("Category not found");
		}
	}
);

// @desc Create a category
// @route POST /api/categories
// @access Private/Admin
const createCategory = asyncHandler(
	async (request: Request<{}, {}, Category>, response: Response) => {
		const { name, image } = request.body;

		const newCategory = await prisma.category.create({
			data: {
				name,
				image,
			},
		});
		response.status(201).json(newCategory);
	}
);

// @desc Update a category
// @route PUT /api/categories/:id
// @access Private/Admin
const updateCategory = asyncHandler(
	async (
		request: Request<{ id: string }, {}, Category>,
		response: Response
	) => {
		const { name, image } = request.body;

		const category = await prisma.category.findUnique({
			where: { id: request.params.id },
		});

		if (category) {
			const updatedCategory = await prisma.category.update({
				where: {
					id: request.params.id,
				},
				data: {
					name,
					image,
				},
			});

			response.status(200).json(updatedCategory);
		} else {
			response.status(404);
			throw new Error("Category not found");
		}
	}
);

// @desc Delete a  category
// @route DELETE /api/categories/:id
// @access Private/Admin
const deleteCategory = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const category = await prisma.category.findUnique({
			where: { id: String(request.params.id) },
		});

		if (category) {
			await prisma.category.delete({ where: { id: request.params.id } });
			response.sendStatus(204);
		} else {
			response.status(404);
			throw new Error("Category not found");
		}
	}
);

export {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
};
