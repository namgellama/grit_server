import { Segment } from "@prisma/client";

export interface ProductRequestDTO {
	name: string;
	description: string;
	image: string;
	price: number;
	segment: Segment;
	isNew: boolean;
	onSale: boolean;
	categoryId: string;
	colors: ColorDTO[];
}

interface SizeDTO {
	size: string;
	stock: number;
}

interface ColorDTO {
	color: string;
	hexColor: string;
	image: string;
	sizes: SizeDTO[];
}
