/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalPrice",
ADD COLUMN     "deliveryCharge" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subTotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0;
