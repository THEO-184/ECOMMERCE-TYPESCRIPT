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

const router = Router();

router
	.route("/")
	.post([authMiddleware, authorizePermissions("admin")], createProductHandler)
	.get(getAllProductsHandler);

router
	.route("/:id")
	.get(getSingleProduct)
	.patch(authMiddleware, authorizePermissions("admin"), updateProductHandler)
	.delete(authMiddleware, authorizePermissions("admin"), deleteProductHandler);
export default router;
