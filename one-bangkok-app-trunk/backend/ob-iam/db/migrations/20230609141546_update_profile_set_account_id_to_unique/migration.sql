/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "profile_account_id_key" ON "profile"("account_id");
