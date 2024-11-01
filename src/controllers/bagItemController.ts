import { BagItem } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../client";
import asyncHandler from "../middlewares/asyncHandler";

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
						variants: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
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
		const { productId, color, size, unitPrice, unitTotalPrice, quantity } =
			request.body;
		const loggedInUserId = request.user?.id;

		const newBagItem = await prisma.bagItem.create({
			data: {
				color,
				size,
				unitPrice,
				unitTotalPrice,
				productId,
				quantity,
				userId: loggedInUserId ?? "",
			},
		});

		response.status(201).json(newBagItem);
	}
);

// @desc Update a bagItem quanitity
// @route PATCH /api/bagItems/:id
// @access Private
const updateBagItem = asyncHandler(
	async (
		request: Request<{ id: string }, {}, BagItem>,
		response: Response
	) => {
		const { quantity, unitTotalPrice } = request.body;

		const bagItem = await prisma.bagItem.findUnique({
			where: { id: request.params.id },
		});

		if (bagItem) {
			const updatedBagItem = await prisma.bagItem.update({
				where: {
					id: request.params.id,
				},
				data: {
					quantity,
					unitTotalPrice,
				},
			});
			response.status(200).json(updatedBagItem);
		} else {
			response.status(404);
			throw new Error("Bag item not found");
		}
	}
);

// @desc Delete a bagItem
// @route DELETE /api/bagItems/:id
// @access Private
const deleteBagItem = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const bagItem = await prisma.bagItem.findUnique({
			where: {
				id: request.params.id,
			},
		});

		if (bagItem) {
			await prisma.bagItem.delete({ where: { id: request.params.id } });
			response.sendStatus(204);
		} else {
			response.status(404);
			throw new Error("Bag item not found");
		}
	}
);

// @desc Delete all bag items
// @route DELETE /api/bagItems
// @access Private
const deleteBagItems = asyncHandler(
	async (request: Request, response: Response) => {
		const userId = request.user?.id;
		await prisma.bagItem.deleteMany({
			where: {
				userId,
			},
		});
		response.sendStatus(204);
	}
);

export {
	createBagItem,
	getBagItems,
	updateBagItem,
	deleteBagItem,
	deleteBagItems,
};
