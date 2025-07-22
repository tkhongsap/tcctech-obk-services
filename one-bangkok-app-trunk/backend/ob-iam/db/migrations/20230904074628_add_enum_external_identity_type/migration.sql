/*
  Warnings:

  - Changed the type of `type` on the `external_identity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExternalIdentityType" AS ENUM ('google', 'apple', 'microsoft');

-- AlterTable
ALTER TABLE "external_identity" DROP COLUMN "type",
ADD COLUMN     "type" "ExternalIdentityType" NOT NULL;
