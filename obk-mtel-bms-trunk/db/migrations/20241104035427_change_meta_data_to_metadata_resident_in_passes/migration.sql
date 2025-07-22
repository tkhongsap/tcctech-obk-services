/*
  Warnings:

  - You are about to drop the column `meta_data` on the `passes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "passes" DROP COLUMN "meta_data",
ADD COLUMN     "metadata_resident" JSON;
