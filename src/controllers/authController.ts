import { attachCookies } from "./../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/userServices";
import { loginUserType, resgisterUserType } from "../schema/authSchema";
import { BadRequest, UnAuthenticated } from "../errors";

export const registerUserHandler = async (
	req: Request<{}, {}, resgisterUserType["body"]>,
	res: Response
) => {
	const user = await registerUser(req.body);
	const { email, role, name, _id } = user;
	attachCookies(res, { _id, role, name });
	res.status(StatusCodes.CREATED).json({ user: { email, role, name } });
};

export const loginHandler = async (
	req: Request<{}, {}, loginUserType["body"]>,
	res: Response
) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequest("provide email and password");
	}
	const user = await loginUser({ email });
	console.log(user);
	if (!user) {
		throw new UnAuthenticated("user not authenticated");
	}
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		throw new UnAuthenticated("user not authenticated");
	}
	const { role, name, _id } = user;
	attachCookies(res, { _id, role, name });
	res.status(StatusCodes.OK).json({ user: { email, role, name } });
};

export const logoutHandler = async (req: Request, res: Response) => {
	res.cookie("token", "", {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.status(StatusCodes.OK).json({ msg: "logged out succesfully" });
};
