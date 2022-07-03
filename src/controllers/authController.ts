import { sendPasswordConfirmation } from "./../utils/sendPasswordConfirmation";
import { sendVerificationEmail } from "./../utils/sendVerificationEmail";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { attachCookies } from "./../utils/jwt";
import { Request, RequestHandler, Response } from "express";
import {
	createRefreshToken,
	loginUser,
	registerUser,
} from "../services/userServices";
import { loginUserType, resgisterUserType } from "../schema/authSchema";
import { BadRequest, NotFound, UnAuthenticated } from "../errors";
import UserModel from "../models/user";
import { sendEmail } from "../utils/sendEmail";
import Token from "../models/token";

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

	const origin = "http://localhost:3001";

	await sendVerificationEmail({
		name: user.email,
		email: user.email,
		verificationToken: user.verificationToken,
		origin,
	});

	res.status(StatusCodes.CREATED).json({
		msg: "account succesfully created.please confirm your email for verification",
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
	// if (!isPasswordMatched) {
	// 	throw new UnAuthenticated("user not authenticated");
	// }
	if (!user.isVerified) {
		throw new UnAuthenticated("email not verified");
	}

	const { role, name, _id } = user;

	// refreshToken
	let refreshToken = "";
	let refreshPayload = refreshToken;

	// check for existing token
	const existingToken = await Token.findOne({ user: user._id });
	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			throw new UnAuthenticated("user not authenticated");
		}
		refreshToken = existingToken.refreshToken;
		refreshPayload = refreshToken;
		attachCookies(res, { _id, role, name }, refreshPayload);
		res.status(StatusCodes.OK).json({ user: { email, role, name } });
		return;
	}
	// create token first time
	refreshToken = crypto.randomBytes(40).toString("hex");
	const userAgent = req.headers["user-agent"]!;
	const ip = req.ip;
	refreshPayload = refreshToken;

	await createRefreshToken({
		refreshToken,
		userAgent,
		ip,
		user: user._id,
	});

	attachCookies(res, { _id, role, name }, refreshPayload);

	res.status(StatusCodes.OK).json({ user: { email, role, name } });
};

export const forgotPassword: RequestHandler<
	any,
	any,
	{ email: string }
> = async (req, res) => {
	const { email } = req.body;

	const user = await UserModel.findOne({ email });
	const origin = "http://localhost:3001";

	if (user) {
		const passwordToken = crypto.randomBytes(70).toString("hex");
		const tenMinutes = 1000 * 60 * 60 * 10;
		const passwordTokenExpiryDate = new Date(Date.now() + tenMinutes);

		// sendEmail;
		await sendPasswordConfirmation({
			email: user.email,
			name: user.name,
			passwordToken,
			origin,
		});

		user.passwordToken = passwordToken;
		user.passwordTokenExpiryDate = passwordTokenExpiryDate;
		await user.save();
	}

	res
		.status(StatusCodes.OK)
		.json({ msg: "Please check your email to confirm password" });
};

export const resetPassword = async (
	req: Request<any, any, { password: string; email: string; token: string }>,
	res: Response
) => {
	const { password, email, token } = req.body;

	if (!password || !email || !token) {
		throw new BadRequest("please provide all fields");
	}

	const user = await UserModel.findOne({ email });
	if (!user) {
		throw new NotFound(`no user found`);
	}

	const currentDate = new Date();
	if (
		user.passwordToken === token &&
		user.passwordTokenExpiryDate > currentDate
	) {
		user.password = password;
		user.passwordToken = "";
		user.passwordTokenExpiryDate = new Date(Date.now());
		await user.save();
	}

	res.status(StatusCodes.OK).json({ msg: "password succesfuly updated" });
};

export const logoutHandler = async (req: Request, res: Response) => {
	await Token.findOneAndDelete({ user: req.user.userId });

	res.cookie("accessToken", "", {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.cookie("resfreshToken", "", {
		expires: new Date(Date.now()),
		httpOnly: true,
	});
	res.status(StatusCodes.OK).json({ msg: "logged out succesfully" });
};
