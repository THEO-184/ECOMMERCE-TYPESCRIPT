import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../errors";

const errorHandlerMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let customErr = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong",
	};

	if (err.name === "ValidationError") {
		customErr.msg = Object.values(err.errors)
			.map((item: any) => item.message)
			.join(",");
		customErr.statusCode = 400;
	}
	if (err.code && err.code === 11000) {
		customErr.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		customErr.statusCode = 400;
	}

	if (err.name === "CastError") {
		customErr.msg = `No item found with id : ${err.value}`;
	}

	return res.status(customErr.statusCode).json({ msg: customErr.msg });
};

export default errorHandlerMiddleware;
