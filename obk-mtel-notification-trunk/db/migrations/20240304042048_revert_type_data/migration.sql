/*
  Warnings:

  - The `data` column on the `message_template` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "message_template" DROP COLUMN "data",
ADD COLUMN     "data" JSON;
