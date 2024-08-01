/*
  Warnings:

  - The values [PENDING,SHIPPED,DELIVERED,CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CASH,ESEWA] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,COMPLETED,FAILED,REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [MEN,WOMEN] on the enum `Segment` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('Pending', 'Shipped', 'Delivered', 'Cancelled');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('Cash', 'Esewa');
ALTER TABLE "Payment" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
ALTER TABLE "Payment" ALTER COLUMN "method" SET DEFAULT 'Cash';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Segment_new" AS ENUM ('Men', 'Women', 'Unisex');
ALTER TABLE "Product" ALTER COLUMN "segment" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "segment" TYPE "Segment_new" USING ("segment"::text::"Segment_new");
ALTER TYPE "Segment" RENAME TO "Segment_old";
ALTER TYPE "Segment_new" RENAME TO "Segment";
DROP TYPE "Segment_old";
ALTER TABLE "Product" ALTER COLUMN "segment" SET DEFAULT 'Men';
COMMIT;

-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "phoneNumber" VARCHAR(10) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "method" SET DEFAULT 'Cash',
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "segment" SET DEFAULT 'Men';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNumber";

-- DropEnum
DROP TYPE "AddressType";

-- CreateIndex
CREATE UNIQUE INDEX "Address_phoneNumber_key" ON "Address"("phoneNumber");
