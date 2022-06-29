import { object, string, TypeOf } from "zod";

export const updateUserSchema = object({
	body: object({
		name: string({
			required_error: "name must be provided",
		})
			.min(3)
			.max(30),
		email: string({
			required_error: "email must be provided",
		}).email("provide valid email"),
	}),
});
export const updateUserSPasswordSchema = object({
	body: object({
		old_password: string({
			required_error: "name must be provided",
		}),
		new_password: string({
			required_error: "email must be provided",
		}),
	}),
});

export type updateUserSchemaType = TypeOf<typeof updateUserSchema>;
export type updateUserPasswordSchema = TypeOf<typeof updateUserSPasswordSchema>;
