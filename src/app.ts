import dotenv from "dotenv";
dotenv.config();
const cloudinary = require("cloudinary").v2;
import "express-async-errors";
import express, { Response, Request } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import validateEnv from "./utils/validateEnv";
// local imports

const app = express();
validateEnv();
//routes imports
import authRouter from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import orderRoutes from "./routes/orderRoutes";
import errorHanlerMiddleware from "./middlewares/default-errorHandler";

// cloudinary config
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_APIKEY,
	api_secret: process.env.CLOUD_SECRET,
});

// middlewares
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
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

const MONGO_URI = process.env.MONGO_URI!;
// start server
const start = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		app.listen(process.env.PORT, () => {
			console.log(`server running on ${process.env.PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
