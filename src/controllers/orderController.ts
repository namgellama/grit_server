import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { Address, OrderItem } from "@prisma/client";

interface OrderRequest {
	orderItems: OrderItem[];
	totalPrice: number;
	address: Address;
}

// @desc Fetch all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (request: Request, response: Response) => {
	const orders = await prisma.order.findMany({
		include: {
			orderItems: true,
			address: true,
			user: {
				select: {
					id: true,
					name: true,
					phoneNumber: true,
					email: true,
				},
			},
		},
	});

	response.status(200).json(orders);
});

// @desc Create an order
// @route POST /api/orders
// @access Public
const createOrder = asyncHandler(
	async (request: Request<{}, {}, OrderRequest>, response: Response) => {
		const { orderItems, totalPrice, address } = request.body;

		const newOrder = await prisma.order.create({
			data: {
				totalPrice,
				orderItems: {
					create: orderItems.map((orderItem: OrderItem) => ({
						productId: orderItem.productId,
						quantity: orderItem.quantity,
						unitPrice: orderItem.unitPrice,
						unitTotalPrice: orderItem.unitTotalPrice,
						size: orderItem.size,
						color: orderItem.color,
					})),
				},
				userId: request.user?.id,
				address: {
					create: {
						addressLine1: address.addressLine1,
						addressLine2: address.addressLine2,
						city: address.city,
						postalCode: address.postalCode,
					},
				},
			},
		});

		response.status(201).json(newOrder);
	}
);

export { getOrders, createOrder };
