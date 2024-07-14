import { Segment, Variant } from "@prisma/client";

export interface ProductRequestDTO {
	name: string;
	description: string;
	sellingPrice: number;
	crossedPrice: number;
	costPerItem: number;
	segment: Segment;
	isNew: boolean;
	categoryId: string;
	variants: Variant[];
}
