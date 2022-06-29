import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-api";

class Unauthorized extends CustomError {
	private statusCode: number;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

export default Unauthorized;
