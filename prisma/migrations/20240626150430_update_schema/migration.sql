/*
  Warnings:

  - You are about to drop the `ColorSize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `colorId` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ColorSize" DROP CONSTRAINT "ColorSize_colorId_fkey";

-- DropForeignKey
ALTER TABLE "ColorSize" DROP CONSTRAINT "ColorSize_sizeId_fkey";

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "colorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ColorSize";

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
