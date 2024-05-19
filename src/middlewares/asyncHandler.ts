import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler =
	(fn: RequestHandler) =>
	(
		request: Request<{ id: string }>,
		response: Response,
		next: NextFunction
	) => {
		Promise.resolve(fn(request, response, next)).catch(next);
	};

export default asyncHandler;
