import { User } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../client";
import asyncHandler from "../middlewares/asyncHandler";
import {
	generateToken,
	hashPassword,
	verifyPassword,
} from "../utils/authUtilites";

interface LoginResponseDTO {
	id: string;
	name: string;
	email: string;
	token: string;
	role: string;
}

// @desc Register user
// @route POST /api/auth/register
// @access Public
const registerUser = asyncHandler(
	async (request: Request<{}, {}, User>, response: Response) => {
		const { email, name, password } = request.body;

		const user = await prisma.user.findFirst({
			where: { email },
		});

		if (!user) {
			const newUser = await prisma.user.create({
				data: {
					name,
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
	async (
		request: Request<{}, {}, User>,
		response: Response<LoginResponseDTO>
	) => {
		const { email, password } = request.body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (user && (await verifyPassword(password, user.password))) {
			const token = generateToken(response, user.id);
			const { id, name, email, role } = user;

			response.status(200).json({
				id,
				name,
				email,
				role,
				token,
			});
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
