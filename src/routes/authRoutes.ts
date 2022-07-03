import { Router } from "express";
import {
	loginHandler,
	logoutHandler,
	registerUserHandler,
	verifyEmail,
	resetPassword,
	forgotPassword,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { loginUserSchema, registerUserSchema } from "../schema/authSchema";
import validateResource from "../utils/validateResource";
const router = Router();

router
	.route("/register")
	.post(validateResource(registerUserSchema), registerUserHandler);

router.route("/login").post(validateResource(loginUserSchema), loginHandler);
router.delete("/logout", authMiddleware, logoutHandler);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password").post(resetPassword);
router.route("/forgot-password").post(forgotPassword);

export default router;
