-- AlterTable
ALTER TABLE "category" ADD COLUMN     "updated_by_name" TEXT;

-- AlterTable
ALTER TABLE "history_category" ADD COLUMN     "updated_by_name" TEXT;

-- AlterTable
ALTER TABLE "history_document" ADD COLUMN     "updated_by_name" TEXT;
