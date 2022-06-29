import { Router } from "express";
import {
	loginHandler,
	logoutHandler,
	registerUserHandler,
} from "../controllers/authController";
import { loginUserSchema, registerUserSchema } from "../schema/authSchema";
import validateResource from "../utils/validateResource";
const router = Router();

router
	.route("/register")
	.post(validateResource(registerUserSchema), registerUserHandler);

router.route("/login").post(validateResource(loginUserSchema), loginHandler);
router.get("/logout", logoutHandler);

export default router;
