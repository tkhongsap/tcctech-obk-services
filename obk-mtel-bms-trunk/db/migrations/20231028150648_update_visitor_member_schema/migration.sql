/*
  Warnings:

  - Added the required column `metadata` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviter_id` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- AlterTable
ALTER TABLE "members" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "inviter_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
