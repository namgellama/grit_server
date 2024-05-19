-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Customer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Customer';
