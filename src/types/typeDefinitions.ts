import { TypeOf } from "zod";
import mongoose from "mongoose";
import { Request, RequestHandler } from "express";
declare module "express-serve-static-core" {
	interface Request {
		user: { name: string; role: string; userId: string };
		files: { image: ImageType };
	}
}

// image file
export interface ImageType {
	name: string;
	data?: any;
	size: number;
	encoding?: any;
	tempFilePath: string;
	mimetype: string;
	md5?: any;
	mv: Function;
}

// send verification email input Type

export interface SendVerificationType {
	name: string;
	email: string;
	verificationToken: string;
	origin: string;
}

export interface ResetPasswordType {
	email: string;
	name: string;
	passwordToken: string;
	origin: string;
}

export enum UserRoles {
	admin = "admin",
	user = "user",
}

// token payload
// export type PayloadType = Pick<UserModelType, "_id" | "role" | "name">;
export type PayloadType = {
	_id: string;
	role: UserRoles;
	name: string;
	refreshPayload?: string;
};

export type ExpressRequest = RequestHandler<{ id: string }>;

// type for CloudinaryFileService
export interface cloudinaryType {
	uploader: {
		upload: (
			path: string,
			options: { use_filename: boolean; foler: string }
		) => Object;
	};
}

// user model
export interface UserModelType extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	role: UserRoles;
	verificationToken: string;
	isVerified: boolean;
	verified: number;
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

// review

export interface ReviewModelType extends mongoose.Document {
	rating: number;
	title: string;
	comment: string;
	user: UserModelType["_id"];
	product: ProductModelType["_id"];
}

export interface ReviewStaticsType extends mongoose.Model<ReviewModelType> {
	calculateAvgRating(
		id: string
	): [{ id: any; numOfReviews: number; averageRating: number }];
}

// OrderSchema

export enum OrderStatus {
	paid = "paid",
	pending = "pending",
	failed = "failed",
	cancelled = "cancelled",
	delivered = "delivered",
}

export interface SingleOrderType {
	name: string;
	image: string;
	price: number;
	amount: number;
	product: ProductModelType["_id"];
}

export interface OrderType extends mongoose.Document {
	tax: number;
	shippingFee: number;
	subTotal: number;
	total: number;
	orderItems: SingleOrderType[];
	status: OrderStatus;
	user: UserModelType["_id"];
	clientSecret: string;
	paymentIntentId: string;
}

export type OrderBody = Pick<OrderType, "tax" | "shippingFee" | "orderItems">;

// refresh Token Type
export interface TokenType extends mongoose.Document {
	refreshToken: string;
	ip: string;
	userAgent: string;
	isValid: boolean;
	user: UserModelType["_id"];
}
