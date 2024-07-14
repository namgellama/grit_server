/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `onSale` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Size` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `categoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Segment" ADD VALUE 'UNISEX';

-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_productId_fkey";

-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_colorId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
DROP COLUMN "onSale",
DROP COLUMN "price",
ADD COLUMN     "costPerItem" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "crossedPrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sellingPrce" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "categoryId" SET NOT NULL;

-- DropTable
DROP TABLE "Color";

-- DropTable
DROP TABLE "Size";

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 10,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
