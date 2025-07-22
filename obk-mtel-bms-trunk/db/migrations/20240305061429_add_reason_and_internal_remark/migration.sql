-- AlterTable
ALTER TABLE "ac_requests" ADD COLUMN     "internal_remark" TEXT,
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "internal_remark" TEXT;
