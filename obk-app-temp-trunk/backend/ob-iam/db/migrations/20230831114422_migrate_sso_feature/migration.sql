/*
  Warnings:

  - You are about to drop the `identity_sso` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `identity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "identity_sso" DROP CONSTRAINT "identity_sso_identity_id_fkey";

-- DropTable
DROP TABLE "identity_sso";

-- CreateTable
CREATE TABLE "identity_external" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "meta" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_external_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "identity_external_account_id_key" ON "identity_external"("account_id");

-- CreateIndex

CREATE INDEX IF NOT EXISTS "identity_external_identifier_created_at_idx" ON "identity_external"("identifier", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "identity_identifier_key" ON "identity"("identifier");

-- AddForeignKey
ALTER TABLE "identity_external" ADD CONSTRAINT "identity_external_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
