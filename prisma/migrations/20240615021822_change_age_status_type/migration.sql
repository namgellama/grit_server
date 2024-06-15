/*
  Warnings:

  - You are about to drop the column `ageStatus` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "ageStatus",
ADD COLUMN     "new" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "AgeStatus";
