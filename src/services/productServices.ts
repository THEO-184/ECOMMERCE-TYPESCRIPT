import { UpdateQuery } from "mongoose";
import ProductModel from "../models/product";
import { ProductModelType } from "../types/typeDefinitions";

export const findProduct = async (id: string) =>
	await ProductModel.findOne({ _id: id })
		.populate("user", "id name role")
		.populate("reviews");

export const updateProduct = async (
	id: string,
	update: Omit<ProductModelType, "user" | "image">
) =>
	await ProductModel.findOneAndUpdate({ _id: id }, update, {
		new: true,
		runValidators: true,
	});
