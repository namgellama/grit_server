import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import prisma from "../../prisma/client";

interface ExtendedJwtPayload extends JwtPayload {
	userId: string;
}

// Protect routes
const protect = asyncHandler(
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			const token = request.cookies.jwt;

			if (!token) {
				throw new Error("Not authorized, no token");
			}

			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET!
			) as ExtendedJwtPayload;
			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
				select: {
					id: true,
					email: true,
					name: true,
					phoneNumber: true,
					role: true,
				},
			});

			if (!user) {
				throw new Error("Not authorized, user not found");
			}

			request.user = user;
			next();
		} catch (error) {
			response.status(401);
			throw new Error("Not authorized, no token");
		}
	}
);

// Admin middleware
const admin = (request: Request, response: Response, next: NextFunction) => {
	if (request.user && request.user.role === "Admin") {
		next();
	} else {
		response.status(401);
		throw new Error("Not authorized as admin");
	}
};

export { admin, protect };
