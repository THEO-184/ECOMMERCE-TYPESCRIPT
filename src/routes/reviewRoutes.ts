import { Router } from "express";
import {
	createReview,
	getAllReviews,
	updateReview,
	deleteReview,
} from "../controllers/reviewController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserRoles } from "../types/typeDefinitions";
import { authorizePermissions } from "../utils/permissions";

const router = Router();

router.route("/").post(authMiddleware, createReview).get(getAllReviews);
router
	.route("/:id")
	.patch(authMiddleware, updateReview)
	.delete(authMiddleware, authorizePermissions(UserRoles.admin), deleteReview);

export default router;
