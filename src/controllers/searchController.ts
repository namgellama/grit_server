import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { Request, response, Response } from "express";

interface SearchParams {
	name?: string;
}

// @desc Get all searched products
// @route GET /api/search
// @access Public
const getSearchedProducts = asyncHandler(
	async (request: Request<{}, {}, {}, SearchParams>, response: Response) => {
		const { name } = request.query;

		if (name) {
			const products = await prisma.product.findMany({
				where: {
					name: {
						contains: name,
						mode: "insensitive",
					},
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
		} else {
			response.status(200).json([]);
		}
	}
);

export { getSearchedProducts };
