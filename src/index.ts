import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (request: Request, response: Response) => {
	response.send("Welcome to Grit server");
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Listening on Port ${PORT}`);
});
