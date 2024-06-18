import express, { Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { promisify } from "util";
import cloudinary from "../utils/cloudinary";

const router = express.Router();

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

const storage = multer.diskStorage({
	destination: async function (request, file, cb) {
		const uploadPath = path.join(__dirname, "../../uploads");
		try {
			await access(uploadPath, fs.constants.F_OK);
		} catch (err) {
			await mkdir(uploadPath, { recursive: true });
		}

		cb(null, "./uploads/");
	},
	filename: function (request, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

function fileFilter(
	request: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) {
	const filetypes = /jpe?g|png|webp/;
	const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = mimetypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", uploadSingleImage, (request: Request, response: Response) => {
	if (request.file)
		cloudinary.uploader.upload(
			request?.file?.path,
			{
				folder: process.env.FOLDER_NAME,
			},
			function (err, result) {
				if (err) {
					return response.status(400).send({ message: err.message });
				}

				response.status(200).send({
					message: "Image uploaded successfully",
					image: result,
				});
			}
		);
});

// router.post(
// 	"/",
// 	asyncHandler(async (request: Request, response: Response) => {
// 		if (request.file)
// 			try {
// 				console.log(request.file.path);
// 				const result = await cloudinary.uploader.upload(
// 					request?.file?.path,
// 					{
// 						folder: process.env.FOLDER_NAME,
// 					}
// 				);

// 				response.status(200).send({
// 					message: "Image uploaded successfully",
// 					image: result,
// 				});
// 			} catch (error: any) {
// 				return response.status(400).send({ message: error.message });
// 			}
// 	})
// );

export default router;
