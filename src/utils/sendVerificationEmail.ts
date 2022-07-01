import { SendVerificationType } from "../types/typeDefinitions";
import { sendEmail } from "./sendEmail";

export const sendVerificationEmail = async ({
	name,
	email,
	verificationToken,
	origin,
}: SendVerificationType) => {
	const verifyEmailURL = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

	const message = `<p>Please confirm your email by clicking on the link below: <a href=${verifyEmailURL}>verify Emaeil</a> </p>`;
	return sendEmail({
		to: email,
		subject: "Email from",
		html: `<h4>Hello ${name}</h4> 
    ${message}
    `,
	});
};
