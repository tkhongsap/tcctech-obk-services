/*
Warnings:

- You are about to drop the column `address` on the `properties` table. All the data in the column will be lost.
- You are about to drop the column `keyword` on the `properties` table. All the data in the column will be lost.

 */
-- AlterTable
ALTER TABLE "properties"
RENAME COLUMN "address" TO "addresses";

ALTER TABLE "properties"
RENAME COLUMN "keyword" TO "keywords";