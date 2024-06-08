import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";

// @desc Get my order details
// @route GET /api/addresses/mine
// @access Private
const getMyLastOrderAddress = asyncHandler(
	async (request: Request, response: Response) => {
		const order = await prisma.order.findFirst({
			where: { userId: request.user?.id },
			orderBy: {
				createdAt: "desc",
			},
		});

		if (order) {
			const address = await prisma.address.findUnique({
				where: {
					orderId: order.id,
				},
			});

			if (address) response.status(200).json(address);
			else {
				response.status(404);
				throw new Error("Address not found");
			}
		} else {
			response.status(404);
			throw new Error("Order not found");
		}
	}
);

export { getMyLastOrderAddress };
