/*
  Warnings:

  - Added the required column `category_id` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "category_id" TEXT NOT NULL;
