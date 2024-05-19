import {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express-serve-static-core";

const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

export default asyncHandler;
