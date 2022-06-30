import { findProduct, updateProduct } from "./../services/productServices";
import { cloudinaryType } from "./../types/typeDefinitions";
import { RequestHandler, Response, Request } from "express";
import { unlinkSync } from "fs";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../errors";
import ProductModel from "../models/product";
import { ProductModelType } from "../types/typeDefinitions";
const cloudinary: cloudinaryType = require("cloudinary").v2;

export const createProductHandler = async (
	req: Request<any, any, ProductModelType>,
	res: Response
) => {
	if (!req.files) {
		throw new BadRequest("upload file");
	}
	const productImg = req.files.image;

	if (!productImg.mimetype.startsWith("image")) {
		throw new BadRequest("file type must be image");
	}

	const maxSize = 1024 * 1204;
	if (productImg.size > maxSize) {
		throw new BadRequest("image size should be atmost 1KB");
	}

	req.body.user = req.user.userId;

	const imgFile: any = await cloudinary.uploader.upload(
		productImg.tempFilePath,
		{
			use_filename: true,
			foler: "ecommerce",
		}
	);
	req.body.image = imgFile.secure_url;

	const product = await ProductModel.create(req.body);

	unlinkSync(productImg.tempFilePath);
	res.status(StatusCodes.CREATED).json({ success: true, product });
};

export const getAllProductsHandler: RequestHandler = async (req, res) => {
	const products = await ProductModel.find({});
	res.status(StatusCodes.OK).json({ count: products.length, products });
};

export const getSingleProduct: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const product = await findProduct(req.params.id);
	if (!product) {
		throw new NotFound(`no product found with id: ${req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ product });
};

export const updateProductHandler: RequestHandler<
	{ id: string },
	any,
	ProductModelType
> = async (req, res) => {
	const product = await updateProduct(req.params.id, req.body);

	if (!product) {
		throw new NotFound(`no product with id ${req.params.id} was found`);
	}

	res.status(StatusCodes.OK).json({ product });
};

export const deleteProductHandler: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const { id } = req.params;
	const product = await ProductModel.findOne({ id: id });
	if (!product) {
		throw new NotFound(`no user with id : ${id} was found`);
	}

	await product.remove();
	res
		.status(StatusCodes.OK)
		.json({ msg: `product with id ${id} successfully deleted` });
};
