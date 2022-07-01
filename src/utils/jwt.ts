import { UserModelType, PayloadType } from "../types/typeDefinitions";
import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";

const secret: Secret = process.env.JWT_SECRET!;
export const createToken = (payload: PayloadType) => {
	const data = jwt.sign(payload, secret, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	return data;
};

export const attachCookies = (res: Response, payload: PayloadType) => {
	const token = createToken(payload);

	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie("token", token, {
		signed: true,
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === "production",
	});
};
