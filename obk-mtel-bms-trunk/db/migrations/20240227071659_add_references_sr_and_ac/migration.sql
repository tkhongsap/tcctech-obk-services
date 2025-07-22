-- AlterTable
ALTER TABLE "ac_requests" ADD COLUMN     "references" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "service_requests" ADD COLUMN     "references" SERIAL NOT NULL;
