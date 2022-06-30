import { checkPersmission } from "./../utils/permissions";
import { StatusCodes } from "http-status-codes";
import { ReviewModelType } from "./../types/typeDefinitions";
import { RequestHandler } from "express";
import ProductModel from "../models/product";
import { BadRequest, NotFound } from "../errors";
import Review from "../models/review";

export const createReview: RequestHandler<any, any, ReviewModelType> = async (
	req,
	res
) => {
	const { product } = req.body;
	const isValid = await ProductModel.findOne({ _id: product });
	if (!isValid) {
		throw new NotFound(`No product with id ${product} was found`);
	}
	const isAlreadyReviewed = await Review.findOne({
		_id: req.user.userId,
		product,
	});

	if (isAlreadyReviewed) {
		throw new BadRequest("product already reviewed by same user");
	}

	req.body.user = req.user.userId;
	const review = await Review.create(req.body);

	res.status(StatusCodes.CREATED).json({ success: true, review });
};

export const getAllReviews: RequestHandler = async (req, res) => {
	const reviews = await Review.find({});

	res.status(StatusCodes.CREATED).json({ count: reviews.length, reviews });
};

export const getSingleReview: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const review = await Review.findOne({ _id: req.params.id }).populate(
		"product",
		"name price category"
	);

	if (!review) {
		throw new NotFound(`no review with id ${req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ review });
};

export const updateReview: RequestHandler<
	{ id: string },
	any,
	Pick<ReviewModelType, "comment" | "title" | "rating">
> = async (req, res) => {
	const {
		params: { id },
		body: { comment, title, rating },
	} = req;

	const review = await Review.findOne({ _id: id });
	if (!review) {
		throw new NotFound(`no review with id ${req.params.id}`);
	}

	review.title = title;
	review.comment = comment;
	review.rating = rating;
	await review.save();
	res
		.status(StatusCodes.OK)
		.json({ msg: `review with id ${id} successfully updated` });
};

export const deleteReview: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const review = await Review.findOne({ _id: req.params.id });
	if (!review) {
		throw new NotFound(`no review with id : ${req.params.id} was found`);
	}

	checkPersmission(req.user, { id: review.user });
	await review.remove();
	res.status(StatusCodes.OK).json({ msg: `review with id : ${req.params.id}` });
};
