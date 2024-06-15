/*
  Warnings:

  - You are about to drop the column `saleStatus` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "saleStatus",
ADD COLUMN     "onSale" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "SaleStatus";
