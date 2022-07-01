import { OrderStatus, SingleOrderType } from "../types/typeDefinitions";
import { RequestHandler } from "express";
import { BadRequest } from "../errors";
import Order from "../models/order";
import ProductModel from "../models/product";
import { OrderBody } from "../types/typeDefinitions";
import { StatusCodes } from "http-status-codes";
import { checkPersmission } from "../utils/permissions";

const fakeStripeAPI = ({
	amount,
	currency,
}: {
	amount: number;
	currency: string;
}) => {
	const client_secret = "somerandomvalue";
	return { client_secret, amount };
};

export const createOrder: RequestHandler<any, any, OrderBody> = async (
	req,
	res
) => {
	const { tax, shippingFee, orderItems: cartItems } = req.body;

	if (!tax || !shippingFee) {
		throw new BadRequest("tax and shippingfee must be provided");
	}
	if (!cartItems || !cartItems.length) {
		throw new BadRequest("provide cart items");
	}

	let orderItems: SingleOrderType[] = [];
	let subTotal = 0;

	for (const item of cartItems) {
		const product = await ProductModel.findOne({ product: item.product });
		if (!product) {
			throw new BadRequest(`No product with id : ${item.product} was found`);
		}
		const { image, name, price } = product;
		// add items to orders
		orderItems.push({
			image,
			name,
			price,
			amount: item.amount,
			product: item.product,
		});
		// calculate sub total
		subTotal += item.amount * price;
	}
	// total cost of order
	const total = tax + shippingFee + subTotal;
	// create stripe payment intent
	const paymentIntent = await fakeStripeAPI({
		amount: total,
		currency: "usd",
	});
	// create order
	const order = await Order.create({
		tax,
		shippingFee,
		subTotal,
		total,
		orderItems,
		user: req.user.userId,
		clientSecret: paymentIntent.client_secret,
	});
	res
		.status(StatusCodes.CREATED)
		.json({ order, clientSecret: order.clientSecret });
};

export const getAllOrders: RequestHandler = async (req, res) => {
	const orders = await Order.find({});
	res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

export const getCurrentUserOrders: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const orders = await Order.find({ user: req.user.userId });
	if (!orders) {
		throw new BadRequest(`No order with id : ${req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

export const getSingleOrder: RequestHandler<{ id: string }> = async (
	req,
	res
) => {
	const order = await Order.findOne({ _id: req.params.id });
	if (!order) {
		throw new BadRequest(`No order with id : ${req.params.id}`);
	}
	checkPersmission(req.user, order.user);
	res.status(StatusCodes.OK).json({ order });
};

export const updateOrder: RequestHandler<{ id: string }> = async (req, res) => {
	const {
		params: { id },
		body: { paymentIntentId },
	} = req;

	const order = await Order.findOne({ _id: id });
	if (!order) {
		throw new BadRequest(`No order with id : ${req.params.id}`);
	}
	checkPersmission(req.user, order.user);
	order.paymentIntentId = paymentIntentId;
	order.status = OrderStatus.paid;
	await order.save();
	res.status(StatusCodes.OK).json({ msg: "successfully updated" });
};
