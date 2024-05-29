import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { BagItem } from "@prisma/client";

// @desc Get all bagItems of logged in user
// @route GET /api/bagItems
// @access Private
const getBagItems = asyncHandler(
	async (request: Request, response: Response) => {
		const bagItems = await prisma.bagItem.findMany({
			where: {
				userId: request.user?.id,
			},
			include: {
				product: {
					select: {
						name: true,
						color: true,
						stock: true,
					},
				},
			},
		});
		response.status(200).json(bagItems);
	}
);

// @desc Create a bagItem
// @route POST /api/bagItems
// @access Private
const createBagItem = asyncHandler(
	async (request: Request<{}, {}, BagItem>, response: Response) => {
		const { productId, color, size, unitPrice, unitTotalPrice } =
			request.body;
		const loggedInUserId = request.user?.id;

		const newBagItem = await prisma.bagItem.create({
			data: {
				color,
				size,
				unitPrice,
				unitTotalPrice,
				productId,
				userId: loggedInUserId ?? "",
			},
		});

		response.status(201).json(newBagItem);
	}
);

export { getBagItems, createBagItem };
