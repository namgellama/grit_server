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

		if (!user) return response.status(404).send("User not found");

		const isMatch = await verifyPassword(password, user.password);

		if (!isMatch) return response.status(400).send("Invalid credentials");

		generateToken(response, user.id);

		response.status(200).json({
			id: user.id,
		});
	}
);

export { loginUser, registerUser };
