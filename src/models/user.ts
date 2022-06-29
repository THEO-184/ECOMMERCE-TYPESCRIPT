import { UserModelType } from "./../types/typeDefinitions";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please provide user name"],
		minLength: 3,
		maxLength: 50,
	},
	email: {
		type: String,
		required: [true, "please provide user email"],
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: "please provide valide email",
		},
	},
	password: {
		type: String,
		required: [true, "please provide user password"],
		minLength: 6,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false,
	},
	verified: Date,
	passwordToken: {
		type: String,
	},
	passwordTokenExpiryDate: {
		type: Date,
	},
});

UserSchema.pre("save", async function () {
	let user = this as UserModelType;
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	let user = this as UserModelType;
	const isMatched = await bcrypt.compare(password, user.password);
	return isMatched;
};

const UserModel = mongoose.model<UserModelType>("User", UserSchema);

export default UserModel;
