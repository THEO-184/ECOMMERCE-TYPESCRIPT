import nodemailer from "nodemailer";
import { nodeMailerConfig } from "./nodeMailConfig";

export const sendEmail = async ({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	const testAccount = nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport(nodeMailerConfig);

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Theophilus Boakye 👻" <theoboakye@example.com>', // sender address
		to,
		subject,
		html,
	});
};
