import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-api";

class BadRequest extends CustomError {
	private statusCode: number;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default BadRequest;
