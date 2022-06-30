import { NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnAuthenticated } from "../errors";
import { ExpressRequest, PayloadType } from "../types/typeDefinitions";

export const authMiddleware: ExpressRequest = (req, res, next) => {
	const token = req.signedCookies.token;
	if (!token) {
		throw new UnAuthenticated("user not authenticated");
	}
	try {
		const decoded = jwt.verify(
			token,
			"MbQeThWmZq4t7w!z%C*F-J@NcRfUjXn2"
		) as PayloadType;

		req.user = {
			name: decoded.name,
			userId: decoded._id,
			role: decoded.role,
		};

		next();
	} catch (error) {
		throw new UnAuthenticated("user not authenticated");
	}
};
