-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('cms', 'app');

-- AlterTable
ALTER TABLE "activity_log" ADD COLUMN     "platform" "PlatformType";
