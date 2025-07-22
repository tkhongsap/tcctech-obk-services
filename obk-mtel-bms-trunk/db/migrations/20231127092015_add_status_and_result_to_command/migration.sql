/*
  Warnings:

  - Added the required column `result` to the `commands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `commands` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commands" ADD COLUMN     "result" JSON NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
