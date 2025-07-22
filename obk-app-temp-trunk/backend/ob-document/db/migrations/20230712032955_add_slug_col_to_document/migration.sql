/*
  Warnings:

  - Added the required column `slug` to the `document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "slug" TEXT NOT NULL;
