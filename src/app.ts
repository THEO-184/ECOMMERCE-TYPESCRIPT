import * as dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express, { Response, Request } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// local imports

const app = express();
//routes imports
import authRouter from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import errorHanlerMiddleware from "./middlewares/default-errorHandler";

// middlewares
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("MbQeThWmZq4t7w!z%C*F-J@NcRfUjXn2"));

app.get("/", (req: Request, res: Response) => {
	res.send("home");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);
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
