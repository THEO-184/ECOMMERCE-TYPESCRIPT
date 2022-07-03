import { TokenType } from "./../types/typeDefinitions";
import mongoose from "mongoose";

const TokenModel = new mongoose.Schema<TokenType>(
	{
		refreshToken: {
			type: String,
			required: true,
		},
		ip: {
			type: String,
			required: true,
		},
		isValid: {
			type: Boolean,
			default: true,
		},
		userAgent: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const Token = mongoose.model<TokenType>("Token", TokenModel);

export default Token;
