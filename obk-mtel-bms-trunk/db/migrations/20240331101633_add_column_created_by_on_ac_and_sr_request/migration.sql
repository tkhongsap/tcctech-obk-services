-- AlterTable
ALTER TABLE "ac_requests" ADD COLUMN     "created_by" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "created_by" TEXT NOT NULL DEFAULT '';
