import path from "path";
import multer, { FileFilterCallback } from "multer";
import express, { request, Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";

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

		cb(null, uploadPath);
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

router.post("/", (request: Request, response: Response) => {
	uploadSingleImage(request, response, function (err) {
		if (err) {
			return response.status(400).send({ message: err.message });
		}

		response.status(200).send({
			message: "Image uploaded successfully",
			image: `/${request?.file?.path}`,
		});
	});
});

export default router;
