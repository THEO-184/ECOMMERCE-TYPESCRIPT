import { TokenType } from "./../types/typeDefinitions";
import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import UserModel from "../models/user";
import { UserModelType } from "../types/typeDefinitions";
import Token from "../models/token";

export const registerUser = async (
	input: DocumentDefinition<
		Pick<UserModelType, "email" | "password" | "name" | "verificationToken">
	>
) => {
	return UserModel.create(input);
};

export const createRefreshToken = async (
	input: Pick<TokenType, "refreshToken" | "user" | "ip" | "userAgent">
) => {
	return Token.create(input);
};

export const loginUser = async (query: Pick<UserModelType, "email">) => {
	return UserModel.findOne(query);
};

export const getAllUsers = async (
	query: Partial<Pick<UserModelType, "role">>
) => {
	return UserModel.find(query).select("-password");
};

export const getSingleUser = async (id: string) => {
	return UserModel.findOne({ _id: id }).select("-password");
};

export const findUserToUpdate = async (
	input: Pick<UserModelType, "email" | "name">
) => {
	const { email } = input;
	return UserModel.findOneAndUpdate({ email }, input);
};
