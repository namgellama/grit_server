/*
  Warnings:

  - You are about to drop the column `productColorId` on the `ColorSize` table. All the data in the column will be lost.
  - You are about to drop the column `productSizeId` on the `ColorSize` table. All the data in the column will be lost.
  - Added the required column `hexColor` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorId` to the `ColorSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `ColorSize` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ColorSize" DROP CONSTRAINT "ColorSize_productColorId_fkey";

-- DropForeignKey
ALTER TABLE "ColorSize" DROP CONSTRAINT "ColorSize_productSizeId_fkey";

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "hexColor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ColorSize" DROP COLUMN "productColorId",
DROP COLUMN "productSizeId",
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "sizeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ColorSize" ADD CONSTRAINT "ColorSize_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorSize" ADD CONSTRAINT "ColorSize_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
