import mongoose from "mongoose";
import { Request, RequestHandler } from "express";

declare module "express-serve-static-core" {
	interface Response {
		myField: string;
	}
	interface Request {
		user: { name: string; role: string; userId: string };
	}
}

export enum UserRoles {
	admin = "admin",
	user = "user",
}

export type PayloadType = Pick<UserModelType, "_id" | "role" | "name">;

export type ExpressRequest = RequestHandler<{ id: string }>;

export interface UserModelType extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
	verificationToken: string;
	isVerified: boolean;
	verified: Date;
	passwordToken: string;
	passwordTokenExpiryDate: Date;
	comparePassword: (input: string) => Promise<boolean>;
}
