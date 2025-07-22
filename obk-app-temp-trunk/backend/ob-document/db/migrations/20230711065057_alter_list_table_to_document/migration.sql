/*
  Warnings:

  - You are about to drop the column `document_type_id` on the `category` table. All the data in the column will be lost.
  - You are about to drop the `list` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type_id` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "list" DROP CONSTRAINT "list_document_category_id_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "document_type_id",
ADD COLUMN     "type_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "list";

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "release_date" TIMESTAMP(3),

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
