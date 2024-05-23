/*
  Warnings:

  - You are about to drop the column `new` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "new",
ADD COLUMN     "newArrival" BOOLEAN NOT NULL DEFAULT true;
