import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-api";

class NotFound extends CustomError {
	private statusCode: number;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

export default NotFound;
