import { NextFunction, RequestHandler } from "express";
import { Unauthorized } from "../errors";

export const authorizePermissions =
	(...roles: string[]): RequestHandler =>
	(req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new Unauthorized("user not authorized to access this resource");
		}
		next();
	};

export const checkPersmission = (
	userObj: { name: string; role: string; userId: string },
	resObj: { id: string }
) => {
	if (userObj.role === "admin") return;
	if (userObj.userId === resObj.id.toString()) return;
	throw new Unauthorized("user not authorized to access this resource");
};
