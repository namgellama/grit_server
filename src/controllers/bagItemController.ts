import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { BagItem } from "@prisma/client";

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

export { createBagItem };
