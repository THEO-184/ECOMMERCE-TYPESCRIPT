import { Router } from "express";
import {
	loginHandler,
	logoutHandler,
	registerUserHandler,
	verifyEmail,
} from "../controllers/authController";
import { loginUserSchema, registerUserSchema } from "../schema/authSchema";
import validateResource from "../utils/validateResource";
const router = Router();

router
	.route("/register")
	.post(validateResource(registerUserSchema), registerUserHandler);

router.route("/login").post(validateResource(loginUserSchema), loginHandler);
router.get("/logout", logoutHandler);
router.route("/verify-email").post(verifyEmail);

export default router;
