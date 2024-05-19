import { User } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prisma/client";
import asyncHandler from "../middlewares/asyncHandler";
import { generateToken, hashPassword, verifyPassword } from "../utils/utilites";

const registerUser = asyncHandler(
	async (request: Request<{}, {}, User>, response: Response) => {
		const { email, phoneNumber, name, password } = request.body;

		const userExist = await prisma.user.findFirst({
			where: { OR: [{ email }, { phoneNumber }] },
		});

		if (userExist) return response.status(400).send("User already exists.");

		const newUser = await prisma.user.create({
			data: {
				name,
				phoneNumber,
				email,
				password: await hashPassword(password),
			},
		});

		response.status(201).json(newUser);
	}
);

const loginUser = asyncHandler(
	async (request: Request<{}, {}, User>, response: Response) => {
		const { phoneNumber, password } = request.body;

		const user = await prisma.user.findUnique({ where: { phoneNumber } });

		if (user && (await verifyPassword(password, user.password))) {
			generateToken(response, user.id);
			response.status(200).json({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			response.status(401);
			throw new Error("Invalid phone number or password");
		}
	}
);

export { loginUser, registerUser };
