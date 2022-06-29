import { RequestHandler, Response, Request } from "express";
import { unlinkSync } from "fs";
import { StatusCodes } from "http-status-codes";
// const fs = require("fs");
import { BadRequest } from "../errors";
const cloudinary = require("cloudinary").v2;

export const createProductHandler = async (req: any, res: any) => {
	if (!req.files) {
		throw new BadRequest("upload file");
	}
	const productImg = req.files.image;
	const imgFile = await cloudinary.uploader.upload(productImg.tempFilePath, {
		use_filename: true,
		foler: "ecommerce",
	});
	// controller
	console.log(imgFile);

	// const productImg = req.files.img;
	res.status(StatusCodes.CREATED).json({ msg: "files" });
};
