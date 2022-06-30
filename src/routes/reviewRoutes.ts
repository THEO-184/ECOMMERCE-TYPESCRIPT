import { Router } from "express";
import {
	createReview,
	getAllReviews,
	updateReview,
} from "../controllers/reviewController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").post(authMiddleware, createReview).get(getAllReviews);
router.route("/:id").patch(authMiddleware, updateReview);

export default router;
