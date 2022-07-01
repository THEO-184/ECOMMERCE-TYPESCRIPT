import {
	OrderStatus,
	OrderType,
	SingleOrderType,
} from "./../types/typeDefinitions";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const singleOrderItemSchema = new Schema<SingleOrderType>({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
});

const OrderSchema = new Schema<OrderType>(
	{
		tax: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		subTotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		orderItems: [singleOrderItemSchema],
		status: {
			type: String,
			enum: OrderStatus,
			default: OrderStatus.pending,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		clientSecret: {
			type: String,
			required: true,
		},
		paymentIntentId: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Order = model<OrderType>("Order", OrderSchema);
export default Order;
