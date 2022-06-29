import {
	updateUserSchemaType,
	updateUserPasswordSchema,
} from "./../schema/userSchema";
import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import {
	getAllUsers,
	getSingleUser,
	findUserToUpdate,
} from "../services/userServices";
import { UserRoles, ExpressRequest } from "../types/typeDefinitions";
import { BadRequest, NotFound } from "../errors";
import { checkPersmission } from "../utils/permissions";
import { attachCookies } from "../utils/jwt";
import UserModel from "../models/user";

export const getAllUsersHandler: RequestHandler = async (req, res) => {
	const users = await getAllUsers({ role: UserRoles.user });
	res.status(StatusCodes.OK).json({ count: users.length, users });
};

export const getSingleUserHandler: ExpressRequest = async (req, res) => {
	const user = await getSingleUser(req.params.id);
	if (!user) {
		throw new NotFound(`no user found with id ${req.params.id}`);
	}

	checkPersmission(req.user, { id: user._id });
	res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUserHandler: ExpressRequest = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUserHandler: RequestHandler<
	any,
	any,
	updateUserSchemaType["body"]
> = async (req, res) => {
	const { email, name } = req.body;

	if (!email || !name) {
		throw new BadRequest("please provide name and email");
	}
	const user = await findUserToUpdate({ email, name });
	if (!user) {
		throw new NotFound("no user found");
	}

	const { _id, role } = user;
	attachCookies(res, { _id, role, name });
	res.status(StatusCodes.OK).json({ user });
};

export const updateUserPasswordHandler: RequestHandler<
	any,
	any,
	updateUserPasswordSchema["body"]
> = async (req, res) => {
	const user = await UserModel.findOne({ _id: req.user.userId });

	if (!user) {
		throw new NotFound("no user found");
	}

	const isPasswordMatched = await user?.comparePassword(req.body.old_password);
	if (!isPasswordMatched) {
		throw new BadRequest("please check your password well");
	}

	user.password = req.body.new_password;
	await user?.save();

	res.status(StatusCodes.OK).json({ msg: "updated successfully" });
};
