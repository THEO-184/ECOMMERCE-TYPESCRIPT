import { attachCookies } from "./../utils/jwt";
import { NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnAuthenticated } from "../errors";
import Token from "../models/token";
import { ExpressRequest, PayloadType } from "../types/typeDefinitions";

export const authMiddleware: ExpressRequest = async (req, res, next) => {
	const { accessToken, refreshToken } = req.signedCookies;

	const secret: jwt.Secret = process.env.JWT_SECRET!;
	try {
		if (accessToken) {
			const decoded = jwt.verify(accessToken, secret) as PayloadType;
			req.user = {
				name: decoded.name,
				userId: decoded._id,
				role: decoded.role,
			};
			return next();
		}

		const decoded = jwt.verify(refreshToken, secret) as PayloadType;
		const existingToken = await Token.findOne({
			user: decoded._id,
			refreshToken: decoded.refreshPayload,
		});

		if (!existingToken || !existingToken.isValid) {
			throw new UnAuthenticated("authentication invalid");
		}
		const { _id, name, role } = decoded;
		const refreshPayload = existingToken.refreshToken;

		attachCookies(res, { _id, name, role }, refreshPayload);

		req.user = {
			name: decoded.name,
			userId: decoded._id,
			role: decoded.role,
		};
		next();
	} catch (error) {
		throw new UnAuthenticated("authentication invalid");
	}
};
