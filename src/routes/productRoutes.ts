import { authMiddleware } from "./../middlewares/authMiddleware";
import { Router } from "express";
import { createProductHandler } from "../controllers/productController";
import { authorizePermissions } from "../utils/permissions";

const router = Router();

router
	.route("/")
	.post([authMiddleware, authorizePermissions("admin")], createProductHandler);

export default router;
