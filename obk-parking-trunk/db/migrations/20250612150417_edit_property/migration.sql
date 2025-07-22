/*
  Warnings:

  - You are about to drop the `mall_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `malls` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "address" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "keyword" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "mall_addresses";

-- DropTable
DROP TABLE "malls";
