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

export const attachCookies = (
	res: Response,
	payload: PayloadType,
	refreshPayload?: string
) => {
	const accessToken = createToken(payload);
	const refreshToken = createToken({ ...payload, refreshPayload });

	const oneDay = 1000 * 60 * 60 * 24;

	const fiveSeconds = 1000;

	res.cookie("accessToken", accessToken, {
		signed: true,
		httpOnly: true,
		maxAge: fiveSeconds,
		secure: process.env.NODE_ENV === "production",
	});
	res.cookie("refreshToken", refreshToken, {
		signed: true,
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === "production",
	});
};
