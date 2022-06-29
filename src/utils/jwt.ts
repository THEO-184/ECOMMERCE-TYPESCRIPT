import { UserModelType, PayloadType } from "../types/typeDefinitions";
import jwt from "jsonwebtoken";
import { Response } from "express";

export const createToken = (payload: PayloadType) => {
	const data = jwt.sign(payload, "MbQeThWmZq4t7w!z%C*F-J@NcRfUjXn2", {
		expiresIn: "1d",
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
