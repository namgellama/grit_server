import { Category } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";

// @desc Create a category
// @route POST /api/categories
// @access Public
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

export { createCategory };
