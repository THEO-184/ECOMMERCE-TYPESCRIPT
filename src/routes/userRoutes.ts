import { authMiddleware } from "./../middlewares/authMiddleware";
import { Router } from "express";
import {
	getAllUsersHandler,
	getSingleUserHandler,
	showCurrentUserHandler,
	updateUserHandler,
	updateUserPasswordHandler,
} from "../controllers/userController";
import { authorizePermissions } from "../utils/permissions";
import { UserRoles } from "../types/typeDefinitions";

const router = Router();

router
	.route("/")
	.get(
		[authMiddleware, authorizePermissions(UserRoles.admin)],
		getAllUsersHandler
	);

router.route("/showMe").get(authMiddleware, showCurrentUserHandler);
router.route("/updateUser").patch(authMiddleware, updateUserHandler);
router
	.route("/updatePassword")
	.patch(authMiddleware, updateUserPasswordHandler);
router.route("/:id").get(authMiddleware, getSingleUserHandler);

export default router;
