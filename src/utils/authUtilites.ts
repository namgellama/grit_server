import bcrypt from "bcryptjs";
import { Response } from "express";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
	password: string,
	hashedPassword: string
) => {
	return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (response: Response, userId: string) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET!, {
		expiresIn: process.env.JWT_EXPIRY_DATE!,
	});
};
