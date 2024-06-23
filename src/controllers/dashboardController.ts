import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";

interface Revenue {
	month: string;
	revenue: string;
}
interface Product {
	id: string;
	name: string;
	count: string;
}

// @desc Get KPI data
// @route GET /api/dashboard/kpi
// @access Private/Admin
const getKPIData = asyncHandler(
	async (request: Request, response: Response) => {
		const revenueData = await prisma.payment.aggregate({
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

		const revenue = revenueData._sum.amount || 0;
		const orderCount = orderCountData._count;

		const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

		const responseData = {
			revenue,
			orderCount,
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
		const revenuesData: Revenue[] = await prisma.$queryRaw`
			SELECT 
			TO_CHAR(DATE_TRUNC('month', "updatedAt"), 'Mon') AS month, 
			SUM("amount") AS "revenue"
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

		const revenues = revenuesData.map(({ month, revenue }) => {
			return {
				month,
				revenue: Number(revenue),
			};
		});

		response.status(200).json(revenues);
	}
);

// @desc Get top 5 most sold product
// @route GET /api/dashboard/mostSold
// @access Private/Admin
const getTop5MostSoldProduct = asyncHandler(
	async (request: Request, response: Response) => {
		const productsData: Product[] = await prisma.$queryRaw`
			SELECT 
			p.id, p.name, COUNT(oi.quantity) "quantity", p.price * COUNT(oi.quantity) "amount"
			FROM "Product" p 
			JOIN "OrderItem" oi 
			ON p.id = oi."productId" 
			GROUP BY p.id 
			ORDER BY quantity DESC
			LIMIT 5 ;
        `;

		const reveneues = productsData.map(({ id, name, count }) => {
			return {
				id,
				name,
				revenue: Number(count),
			};
		});

		response.status(200).json(reveneues);
	}
);

export { getKPIData, getRevenueByMonth, getTop5MostSoldProduct };
