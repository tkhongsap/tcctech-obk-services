/*
  Warnings:

  - Changed the type of `data` on the `message_template` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "message_template" DROP COLUMN "data",
ADD COLUMN     "data" JSON NOT NULL;
