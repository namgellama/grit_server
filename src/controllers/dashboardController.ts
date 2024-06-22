import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";
import moment from "moment";

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

export { getRevenue, getOrdersCount, getAverageOrderValue };
