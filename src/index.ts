import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express-serve-static-core";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (request: Request, response: Response) => {
	response.send("Welcome to Grit server");
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Listening on Port ${PORT}`);
});
