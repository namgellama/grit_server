import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import {
	Address,
	OrderItem,
	OrderStatus,
	Payment,
	PaymentStatus,
} from "@prisma/client";

interface OrderRequest {
	orderItems: OrderItem[];
	subTotal: number;
	deliveryCharge: number;
	total: number;
	address: Address;
	payment: Payment;
}

interface QueryParams {
	orderStatus?: OrderStatus;
	paymentStatus?: PaymentStatus;
	sortOrder?: "asc" | "desc";
}

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (request: Request, response: Response) => {
	const orders = await prisma.order.findMany({
		include: {
			payment: true,
			user: {
				select: {
					id: true,
					name: true,
					phoneNumber: true,
					email: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	response.status(200).json(orders);
});

// @desc Get order details
// @route GET /api/orders/:id
// @access Private/Admin
const getOrder = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const order = await prisma.order.findUnique({
			where: { id: request.params.id },
			include: {
				address: true,
				payment: true,
				user: true,
				orderItems: {
					include: {
						product: {
							select: {
								name: true,
								color: true,
							},
						},
					},
				},
			},
		});

		if (order) response.status(200).json(order);
		else {
			response.status(404);
			throw new Error("Order not found");
		}
	}
);

// @desc Get my orders
// @route GET /api/orders/mine
// @access Private
const getMyOrders = asyncHandler(
	async (request: Request<{}, {}, {}, QueryParams>, response: Response) => {
		const { orderStatus, paymentStatus, sortOrder } = request.query;

		const orders = await prisma.order.findMany({
			where: {
				userId: request.user?.id,
				status: orderStatus,
				payment: {
					status: paymentStatus,
				},
			},
			include: {
				orderItems: {
					include: {
						product: {
							select: {
								name: true,
								color: true,
							},
						},
					},
				},
				address: true,
				payment: true,
			},
			orderBy: {
				createdAt: sortOrder ?? "desc",
			},
		});

		response.status(200).json(orders);
	}
);

// @desc Get my order details
// @route GET /api/orders/mine/:id
// @access Private
const getMyOrder = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const order = await prisma.order.findUnique({
			where: { id: request.params.id },
			include: {
				address: true,
				payment: true,
				orderItems: {
					include: {
						product: {
							select: {
								name: true,
								color: true,
							},
						},
					},
				},
			},
		});

		if (order) response.status(200).json(order);
		else {
			response.status(404);
			throw new Error("Order not found");
		}
	}
);

// @desc Create an order
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(
	async (request: Request<{}, {}, OrderRequest>, response: Response) => {
		const {
			orderItems,
			subTotal,
			deliveryCharge,
			total,
			address,
			payment,
		} = request.body;

		const newOrder = await prisma.order.create({
			data: {
				subTotal,
				deliveryCharge,
				total,
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

export { getOrders, getOrder, getMyOrders, getMyOrder, createOrder };
