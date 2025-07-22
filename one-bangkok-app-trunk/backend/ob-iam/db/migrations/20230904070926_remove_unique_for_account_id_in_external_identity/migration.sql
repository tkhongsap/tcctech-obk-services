/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `identity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "external_identity_account_id_key";

-- DropIndex
DROP INDEX "identity_identifier_key";

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "identity_identifier_key" ON "identity"("identifier");
