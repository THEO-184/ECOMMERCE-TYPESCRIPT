import { UserModelType, UserRoles } from "./../types/typeDefinitions";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema<UserModelType>({
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
		enum: UserRoles,
		default: UserRoles.user,
	},
	verificationToken: String,
	isVerified: {
		type: Boolean,
		default: false,
	},
	verified: Number,
	passwordToken: {
		type: String,
	},
	passwordTokenExpiryDate: {
		type: Date,
	},
});

UserSchema.pre("save", async function (next) {
	let user = this as UserModelType;
	if (!user.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	return next();
});

UserSchema.methods.comparePassword = async function (
	password: string
): Promise<boolean> {
	// let user = this as UserModelType;
	const isMatched = await bcrypt.compare(password, this.password);
	return isMatched;
};

const UserModel = mongoose.model<UserModelType>("User", UserSchema);

export default UserModel;
