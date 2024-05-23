/*
  Warnings:

  - You are about to drop the column `newArrival` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AgeStatus" AS ENUM ('New', 'Old');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('Normal', 'OnSale');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "newArrival",
ADD COLUMN     "ageStatus" "AgeStatus" NOT NULL DEFAULT 'New',
ADD COLUMN     "saleStatus" "SaleStatus" NOT NULL DEFAULT 'Normal';
