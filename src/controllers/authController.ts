import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../../prisma/client";
import { User } from "@prisma/client";
import { hashPassword } from "../utils/hashPassword";

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

export { registerUser };
