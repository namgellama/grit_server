import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import addressRoutes from "./routes/addressRoutes";
import authRoutes from "./routes/authRoutes";
import bagItemRoutes from "./routes/bagItemRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:5173"],
	})
);

app.get("/", (request: Request, response: Response) => {
	response.send("Welcome to Grit server");
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bagItems", bagItemRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Listening on Port ${PORT}`);
});
