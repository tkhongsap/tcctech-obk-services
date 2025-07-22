-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "created_by" TEXT DEFAULT '-',
ADD COLUMN     "created_by_name" TEXT DEFAULT '-';
