/*
  Warnings:

  - The values [UNISEX] on the enum `Segment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Segment_new" AS ENUM ('MEN', 'WOMEN');
ALTER TABLE "Product" ALTER COLUMN "segment" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "segment" TYPE "Segment_new" USING ("segment"::text::"Segment_new");
ALTER TYPE "Segment" RENAME TO "Segment_old";
ALTER TYPE "Segment_new" RENAME TO "Segment";
DROP TYPE "Segment_old";
ALTER TABLE "Product" ALTER COLUMN "segment" SET DEFAULT 'MEN';
COMMIT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "segment" SET DEFAULT 'MEN';
