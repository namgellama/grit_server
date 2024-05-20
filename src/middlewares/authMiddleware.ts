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
		let token;
		token = request.cookies.token;

		if (token) {
			try {
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

				console.log(user);

				request.user = user!;
				console.log(request.user);
				next();
			} catch {
				response.status(401);
				throw new Error("Not authorized, token failed");
			}
		} else {
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
