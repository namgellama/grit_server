import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";
import json from "../utils/json";

// @desc Get revenue
// @route GET /api/dashboard/revenue
// @access Private/Admin
const getRevenue = asyncHandler(
	async (request: Request, response: Response) => {
		const currentRevenue = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
			},
		});

		response.status(200).json(currentRevenue);
	}
);

const getOrdersCount = asyncHandler(
	async (request: Request, response: Response) => {
		const orderCount = await prisma.order.aggregate({
			_count: true,
			where: {
				status: {
					not: "CANCELLED",
				},
			},
		});

		response.status(200).json(orderCount);
	}
);

const getAverageOrderValue = asyncHandler(
	async (request: Request, response: Response) => {
		const totalRevenueData = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
			},
		});

		const orderCountData = await prisma.order.aggregate({
			_count: true,
			where: {
				status: {
					not: "CANCELLED",
				},
			},
		});

		const totalRevenue = totalRevenueData._sum.amount || 0;
		const totalOrders = orderCountData._count;

		const averageOrderValue =
			totalOrders > 0 ? totalRevenue / totalOrders : 0;

		const responseData = {
			totalRevenue,
			totalOrders,
			averageOrderValue,
		};

		response.status(200).json(responseData);
	}
);

const getTop5MostSoldProduct = asyncHandler(
	async (request: Request, response: Response) => {
		const result = await prisma.$queryRaw`
           Select 
		   p.id, p.name, COUNT(oi.quantity) 
		   from "Product" p 
		   JOIN "OrderItem" oi 
		   ON p.id = oi."productId" 
		   GROUP BY p.id 
		   ORDER BY count DESC
		   LIMIT 5 ;
        `;

		response.status(200).send(json(result));
	}
);

export {
	getAverageOrderValue,
	getOrdersCount,
	getRevenue,
	getTop5MostSoldProduct,
};
