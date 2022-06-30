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
	async function calculateAvgRating(productId: string) {
		const result = await this.aggregate([
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
		console.log(result);
	}
);

const Review = model<ReviewModelType, ReviewStaticsType>(
	"Review",
	ReviewSchema
);

ReviewSchema.pre("save", async function () {
	// await Review.calculateAvgRating(this.product);
	console.log("save triggered");
});

ReviewSchema.post("remove", async function () {
	await Review.calculateAvgRating(this.product);
});

export default Review;
