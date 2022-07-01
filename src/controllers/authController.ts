import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { attachCookies } from "./../utils/jwt";
import { Request, RequestHandler, Response } from "express";
import { loginUser, registerUser } from "../services/userServices";
import { loginUserType, resgisterUserType } from "../schema/authSchema";
import { BadRequest, NotFound, UnAuthenticated } from "../errors";
import UserModel from "../models/user";

export const registerUserHandler = async (
	req: Request<{}, {}, resgisterUserType["body"]>,
	res: Response
) => {
	const { name, email, password } = req.body;

	const verificationToken = crypto.randomBytes(40).toString("hex");

	const user = await registerUser({
		name,
		email,
		password,
		verificationToken,
	});
	// const { email, role, name, _id } = user;
	// attachCookies(res, { _id, role, name });
	// res.status(StatusCodes.CREATED).json({ user: { email, role, name } });

	res.status(StatusCodes.CREATED).json({
		msg: "account succesfully created.please confirm your email for verification",
		verificationToken: user.verificationToken,
	});
};

export const verifyEmail: RequestHandler<
	any,
	any,
	{ verificationToken: string; email: string }
> = async (req, res) => {
	const { verificationToken, email } = req.body;

	if (!verificationToken || !email) {
		throw new BadRequest("provide verification token and email");
	}

	const user = await UserModel.findOne({ email });
	if (!user) {
		throw new NotFound("user not authenticated");
	}

	if (user.verificationToken !== verificationToken) {
		throw new UnAuthenticated("user not authenticated");
	}
	user.isVerified = true;
	user.verified = Date.now();
	user.verificationToken = "";
	await user.save();

	res.status(StatusCodes.OK).json({ msg: "email verified" });
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
	if (!user) {
		throw new UnAuthenticated("user not authenticated");
	}
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		throw new UnAuthenticated("user not authenticated");
	}
	if (!user.isVerified) {
		throw new UnAuthenticated("email not verified");
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
