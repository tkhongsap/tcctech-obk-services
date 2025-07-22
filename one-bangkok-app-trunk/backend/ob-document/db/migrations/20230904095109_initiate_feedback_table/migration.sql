-- CreateTable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "feedback" (
    "id" TEXT DEFAULT uuid_generate_v4(),
    "account_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "like" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_account_id_document_id_idx" ON "feedback"("account_id", "document_id");

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "feedback" ADD UNIQUE ("account_id" , "document_id");
