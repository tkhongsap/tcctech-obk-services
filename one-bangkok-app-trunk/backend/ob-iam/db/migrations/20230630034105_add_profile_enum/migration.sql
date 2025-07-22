/*
  Warnings:

  - The `gender` column on the `profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `title` column on the `profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProfileTitle" AS ENUM ('mr', 'mrs', 'ms', 'dr');

-- CreateEnum
CREATE TYPE "ProfileGender" AS ENUM ('male', 'female', 'nonbinary');

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "gender",
ADD COLUMN     "gender" "ProfileGender",
DROP COLUMN "title",
ADD COLUMN     "title" "ProfileTitle",
ALTER COLUMN "middle_name" DROP NOT NULL;
