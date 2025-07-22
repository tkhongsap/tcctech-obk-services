-- CreateEnum
CREATE TYPE "SupportLanguage" AS ENUM ('th', 'en', 'cs');

-- AlterTable
ALTER TABLE "setting" ADD COLUMN     "current_language" "SupportLanguage" NOT NULL DEFAULT 'en';
