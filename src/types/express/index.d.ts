import { User } from "@prisma/client";

type RequestUser = {
	id: string;
} & Partial<User>;

declare module "express-serve-static-core" {
	interface Request {
		user: RequestUser;
	}
}
