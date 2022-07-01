import { Router } from "express";
import { authMiddleware } from "./../middlewares/authMiddleware";
import {
	createOrder,
	getAllOrders,
	getCurrentUserOrders,
	getSingleOrder,
	updateOrder,
} from "../controllers/orderController";

import { authorizePermissions } from "../utils/permissions";
import { UserRoles } from "../types/typeDefinitions";
import { getReviewsOnProduct } from "../controllers/reviewController";

const router = Router();

router
	.route("/")
	.post([authMiddleware], createOrder)
	.get(authMiddleware, authorizePermissions(UserRoles.admin), getAllOrders);

router.route("/my-orders").get(authMiddleware, getCurrentUserOrders);
router
	.route("/:id")
	.get(authMiddleware, getSingleOrder)
	.patch(authMiddleware, updateOrder);
router.route("/:id/reviews").get(getReviewsOnProduct);

export default router;
