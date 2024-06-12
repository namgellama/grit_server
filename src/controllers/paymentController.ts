import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { PaymentStatus } from "@prisma/client";

const updatePayment = asyncHandler(
	async (
		request: Request<{ id: string }, {}, { status: PaymentStatus }>,
		response: Response
	) => {
		const { status } = request.body;

		const order = await prisma.order.findUnique({
			where: {
				id: request.params.id,
			},
		});

		if (order) {
			const updatedPayment = await prisma.payment.update({
				where: {
					orderId: order.id,
				},
				data: {
					status,
				},
			});

			response.status(200).json(updatedPayment);
		} else {
			response.status(404);
			throw new Error("Order not found");
		}
	}
);

export { updatePayment };
