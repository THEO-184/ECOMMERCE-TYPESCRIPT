import * as dotenv from "dotenv";
const cloudinary = require("cloudinary").v2;
dotenv.config();
import "express-async-errors";
import express, { Response, Request } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
// local imports

const app = express();
//routes imports
import authRouter from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import orderRoutes from "./routes/orderRoutes";
import errorHanlerMiddleware from "./middlewares/default-errorHandler";

// cloudinary config
cloudinary.config({
	cloud_name: "dolgpezth",
	api_key: "883425872941863",
	api_secret: "tzCe1vngglwHKbJgZWzx2pq6jmg",
});

// middlewares
app.use(morgan("tiny"));
app.use(cookieParser("MbQeThWmZq4t7w!z%C*F-J@NcRfUjXn2"));
app.use(express.json({ type: "" }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
	res.send("home");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use(errorHanlerMiddleware);
const PORT = process.env.PORT || 3000;

// start server
const start = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://Theo:effa8KISSI7@nodeexpressproject.eemhb.mongodb.net/Final-Ecommerce?retryWrites=true&w=majority"
		);
		app.listen(3000, () => {
			console.log(`server running on ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
