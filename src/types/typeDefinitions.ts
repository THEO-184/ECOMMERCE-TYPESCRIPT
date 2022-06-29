import mongoose from "mongoose";
import { Request, RequestHandler } from "express";

declare module "express-serve-static-core" {
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

// user model
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

// product model
export interface ProductModelType extends mongoose.Document {
	name: string;
	price: number;
	description: string;
	image: string;
	category: string;
	company: string;
	colors: string[];
	featured: boolean;
	freeShipping: boolean;
	inventory: number;
	averageRating: number;
	numOfReviews: number;
	user: UserModelType["_id"];
}
