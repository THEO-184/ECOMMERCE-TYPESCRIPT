import { ResetPasswordType } from "../types/typeDefinitions";
import { sendEmail } from "./sendEmail";

export const sendPasswordConfirmation = ({
	email,
	name,
	passwordToken,
	origin,
}: ResetPasswordType) => {
	const resetURL = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
	const message = `Please click on the following to reset : 
    <a href=${resetURL}>Reset Password</a>
    `;

	return sendEmail({
		to: email,
		subject: "Reset Password",
		html: `Hello ${name}
        ${message}
        `,
	});
};
