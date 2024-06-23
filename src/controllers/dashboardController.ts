import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";
import json from "../utils/json";

// @desc Get revenue
// @route GET /api/dashboard/revenue
// @access Private/Admin
const getRevenue = asyncHandler(
	async (request: Request, response: Response) => {
		const revenue = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
			},
		});

		response.status(200).json(revenue);
	}
);

// @desc Get orders count
// @route GET /api/dashboard/ordersCount
// @access Private/Admin
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

// @desc Get average order value
// @route GET /api/dashboard/averageOrderValue
// @access Private/Admin
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

// @desc Get revenue by month
// @route GET /api/dashboard/revenueByMonth
// @access Private/Admin
const getRevenueByMonth = asyncHandler(
	async (request: Request, response: Response) => {
		const reveneues = await prisma.$queryRaw`
			SELECT 
			TO_CHAR(DATE_TRUNC('month', "updatedAt"), 'Mon') AS month, 
			SUM("amount") "totalAmount"
			FROM 
			"Payment"
			WHERE 
			"status" = 'COMPLETED' 
			AND EXTRACT(YEAR FROM "updatedAt") = EXTRACT(YEAR FROM CURRENT_DATE)
			GROUP BY 
			DATE_TRUNC('month', "updatedAt")
			ORDER BY 
			DATE_TRUNC('month', "updatedAt");
		`;

		response.status(200).send(json(reveneues));
	}
);

// @desc Get top 5 most sold product
// @route GET /api/dashboard/mostSold
// @access Private/Admin
const getTop5MostSoldProduct = asyncHandler(
	async (request: Request, response: Response) => {
		const result = await prisma.$queryRaw`
			SELECT 
			p.id, p.name, COUNT(oi.quantity) 
			FROM "Product" p 
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
	getRevenueByMonth,
};
