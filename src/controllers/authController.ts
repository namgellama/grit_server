import { User } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";
import { generateToken, hashPassword, verifyPassword } from "../utils/utilites";

// @desc Register user
// @route POST /api/auth/register
// @access Public
const registerUser = asyncHandler(
	async (request: Request<{}, {}, User>, response: Response) => {
		const { email, phoneNumber, name, password } = request.body;

		const user = await prisma.user.findFirst({
			where: { OR: [{ email }, { phoneNumber }] },
		});

		if (user) {
			const newUser = await prisma.user.create({
				data: {
					name,
					phoneNumber,
					email,
					password: await hashPassword(password),
				},
			});

			response.status(201).json(newUser);
		} else {
			response.status(400);
			throw new Error("User already exists.");
		}
	}
);

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = asyncHandler(
	async (request: Request<{}, {}, User>, response: Response) => {
		const { phoneNumber, password } = request.body;

		const user = await prisma.user.findUnique({ where: { phoneNumber } });

		if (user && (await verifyPassword(password, user.password))) {
			const token = generateToken(response, user.id);
			response.status(200).json(token);
		} else {
			response.status(401);
			throw new Error("Invalid phone number or password");
		}
	}
);

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
const logoutUser = asyncHandler(
	async (request: Request, response: Response) => {
		response.cookie("token", "", {
			httpOnly: true,
			expires: new Date(0),
		});
		response.status(200).json({ message: "Logged out successfully" });
	}
);

export { loginUser, registerUser, logoutUser };
