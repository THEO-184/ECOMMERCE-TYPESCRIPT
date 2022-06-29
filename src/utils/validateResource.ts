import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { CustomError } from "../errors";

const validateResource =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				params: req.params,
				query: req.query,
				files: req.files,
			});
			next();
		} catch (error: any) {
			throw new CustomError(error);
		}
	};

export default validateResource;
