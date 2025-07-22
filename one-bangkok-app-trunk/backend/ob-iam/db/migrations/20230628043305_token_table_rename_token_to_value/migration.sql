/*
  Warnings:

  - You are about to drop the column `token` on the `token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `token` will be added. If there are existing duplicate values, this will fail.
  - The required column `value` was added to the `token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "token_token_key";

-- AlterTable
ALTER TABLE "token" DROP COLUMN "token",
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "token_value_key" ON "token"("value");
