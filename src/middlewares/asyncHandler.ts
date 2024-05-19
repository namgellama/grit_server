import {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express-serve-static-core";

const asyncHandler = (
	fn: (
		request: Request,
		response: Response,
		next: NextFunction
	) => Promise<any>
): RequestHandler => {
	return (request: Request, response: Response, next: NextFunction): void => {
		Promise.resolve(fn(request, response, next)).catch(next);
	};
};

export default asyncHandler;
