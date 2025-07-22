/*
  Warnings:

  - You are about to drop the `logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_category_id_fkey";

-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_document_id_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "history_categoryId" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "logs";

-- CreateTable
CREATE TABLE "history_document" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "category_id" TEXT NOT NULL,
    "title" JSON NOT NULL,
    "body" JSON NOT NULL,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "release_date" TIMESTAMP(3),
    "slug" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "docuemnt_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "history_category_id" TEXT,

    CONSTRAINT "history_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_category" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "title" JSON NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "category_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "history_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_history_categoryId_fkey" FOREIGN KEY ("history_categoryId") REFERENCES "history_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_document" ADD CONSTRAINT "history_document_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_document" ADD CONSTRAINT "history_document_docuemnt_id_fkey" FOREIGN KEY ("docuemnt_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_document" ADD CONSTRAINT "history_document_history_category_id_fkey" FOREIGN KEY ("history_category_id") REFERENCES "history_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_category" ADD CONSTRAINT "history_category_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_category" ADD CONSTRAINT "history_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
