import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";

const getCurrentUser = asyncHandler(
	async (request: Request, response: Response) => {
		response.status(200).json(request.user);
	}
);

export { getCurrentUser };
