import express, { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import asyncHandler from "../middlewares/asyncHandler";
import cloudinary from "../utils/cloudinary";

const router = express.Router();

router.post(
	"/",
	asyncHandler(
		async (
			request: Request<{}, {}, { image: string }>,
			response: Response
		) => {
			if (!request.files) {
				return response
					.status(400)
					.send({ message: "No file uploaded" });
			}

			const imageFile = request.files.image as UploadedFile;

			try {
				const result = await cloudinary.uploader.upload(
					imageFile.tempFilePath,
					{
						upload_preset: process.env.PRESET,
					}
				);

				response.status(200).send({
					message: "Image uploaded successfully",
					image: result,
				});
			} catch (error: any) {
				response.status(500);
				throw new Error(error.message);
			}
		}
	)
);

export default router;
