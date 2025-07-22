/*
  Warnings:

  - You are about to drop the `identity_external` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "identity_external" DROP CONSTRAINT "identity_external_account_id_fkey";

-- DropTable
DROP TABLE "identity_external";

-- CreateTable
CREATE TABLE "external_identity" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "meta" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_identity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "external_identity_account_id_key" ON "external_identity"("account_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "external_identity_identifier_created_at_idx" ON "external_identity"("identifier", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "external_identity" ADD CONSTRAINT "external_identity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
