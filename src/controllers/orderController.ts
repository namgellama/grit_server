import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { Address, OrderItem, Payment } from "@prisma/client";

interface OrderRequest {
	orderItems: OrderItem[];
	totalPrice: number;
	address: Address;
	payment: Payment;
}

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (request: Request, response: Response) => {
	const orders = await prisma.order.findMany({
		include: {
			orderItems: {
				include: {
					product: {
						select: {
							name: true,
						},
					},
				},
			},
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

// @desc Get my orders
// @route GET /api/orders/mine
// @access Private
const getMyOrders = asyncHandler(
	async (request: Request, response: Response) => {
		const orders = await prisma.order.findMany({
			where: {
				userId: request.user?.id,
			},
			include: {
				orderItems: {
					include: {
						product: {
							select: {
								name: true,
							},
						},
					},
				},
				address: true,
			},
		});

		response.status(200).json(orders);
	}
);

// @desc Create an order
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(
	async (request: Request<{}, {}, OrderRequest>, response: Response) => {
		const { orderItems, totalPrice, address, payment } = request.body;

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
				payment: {
					create: {
						amount: payment.amount,
						method: payment.method,
						status:
							payment.method === "CASH"
								? "PENDING"
								: payment.status,
					},
				},
			},
		});

		response.status(201).json(newOrder);
	}
);

export { getOrders, getMyOrders, createOrder };
