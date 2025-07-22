-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "submitted_by_name" TEXT DEFAULT '-',
ADD COLUMN     "updated_by_name" TEXT DEFAULT '-';
