import path from "path";
import multer, { FileFilterCallback } from "multer";
import express, { Request, Response } from "express";

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (request, file, cb) {
		cb(null, "uploads");
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
