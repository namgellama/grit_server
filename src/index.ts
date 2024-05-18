import express from "express";
import { Request, Response } from "express-serve-static-core";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/", (request: Request, response: Response) => {
	return response.send("Welcome to Grit server");
});

app.listen(PORT, () => {
	console.log(`Listening on Port ${PORT}`);
});
