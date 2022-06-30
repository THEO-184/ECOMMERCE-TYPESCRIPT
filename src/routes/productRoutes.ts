import { authMiddleware } from "./../middlewares/authMiddleware";
import { Router } from "express";
import {
	createProductHandler,
	getAllProductsHandler,
	getSingleProduct,
	updateProductHandler,
	deleteProductHandler,
} from "../controllers/productController";
import { authorizePermissions } from "../utils/permissions";
import { UserRoles } from "../types/typeDefinitions";
import { getReviewsOnProduct } from "../controllers/reviewController";

const router = Router();

router
	.route("/")
	.post(
		[authMiddleware, authorizePermissions(UserRoles.admin)],
		createProductHandler
	)
	.get(getAllProductsHandler);

router
	.route("/:id")
	.get(getSingleProduct)
	.patch(
		authMiddleware,
		authorizePermissions(UserRoles.admin),
		updateProductHandler
	)
	.delete(
		authMiddleware,
		authorizePermissions(UserRoles.admin),
		deleteProductHandler
	);
router.route("/:id/reviews").get(getReviewsOnProduct);
export default router;
