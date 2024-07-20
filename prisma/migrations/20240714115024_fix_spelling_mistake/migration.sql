/*
  Warnings:

  - You are about to drop the column `sellingPrce` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sellingPrce",
ADD COLUMN     "sellingPrice" INTEGER NOT NULL DEFAULT 0;