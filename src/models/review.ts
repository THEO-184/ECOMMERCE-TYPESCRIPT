import mongoose from "mongoose";
import { ReviewModelType, ReviewStaticsType } from "../types/typeDefinitions";

const { Schema, model } = mongoose;

const ReviewSchema = new Schema<ReviewModelType, ReviewStaticsType>(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, "please provide rating value"],
		},
		title: {
			type: String,
			trim: true,
			required: [true, "atmost hundred characters expected"],
			maxlength: 100,
		},
		comment: {
			type: String,
			required: [true, "please provide comment on product"],
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		product: {
			type: mongoose.Types.ObjectId,
			ref: "Product",
			required: true,
		},
	},

	{ timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// calculate avg rating

ReviewSchema.static(
	"calculateAvgRating",
	async function calculateAvgRating(productId: any) {
		const result: any = await this.aggregate([
			{ $match: { product: productId } },
			{ $project: { _id: 0, rating: 1 } },
			{
				$group: {
					_id: null,
					numOfReviews: { $sum: 1 },
					averageRating: { $avg: "$rating" },
				},
			},
		]);
		return result;
		// console.log(result);
	}
);

ReviewSchema.post("save", async function () {
	const reviewUpdate = await Review.calculateAvgRating(this.product);
	await this.$model("Product").findOneAndUpdate(
		{ _id: this.product },
		{
			averageRating: reviewUpdate[0].averageRating || 0,
			numOfReviews: reviewUpdate[0].numOfReviews || 0,
		}
	);
});

ReviewSchema.pre("remove", async function () {
	const reviewUpdate = await Review.calculateAvgRating(this.product);
	await this.$model("Product").findOneAndUpdate(
		{ _id: this.product },
		{
			averageRating: reviewUpdate[0].averageRating || 0,
			numOfReviews: reviewUpdate[0].numOfReviews || 0,
		}
	);
	console.log(reviewUpdate);
});

const Review = model<ReviewModelType, ReviewStaticsType>(
	"Review",
	ReviewSchema
);

export default Review;
