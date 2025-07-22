-- AlterTable
ALTER TABLE "category" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "deleted_at" TIMESTAMP(3);
