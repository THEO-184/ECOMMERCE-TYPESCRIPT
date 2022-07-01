import { UserRoles } from "./../types/typeDefinitions";
import { object, string, TypeOf, nativeEnum } from "zod";

export const registerUserSchema = object({
	body: object({
		name: string({
			required_error: "name must be provided",
		}),
		email: string({
			required_error: "email must be provided",
		}).email("not a valid email"),
		password: string({
			required_error: "name must be provided",
		}),
	}),
});

export const loginUserSchema = object({
	body: object({
		email: string({
			required_error: "email must be provided",
		}).email("not a valid email"),
		password: string({
			required_error: "password must be provided",
		}),
	}),
});

export type resgisterUserType = TypeOf<typeof registerUserSchema>;
export type loginUserType = TypeOf<typeof loginUserSchema>;
