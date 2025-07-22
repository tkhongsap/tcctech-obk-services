/*
  Warnings:

  - Made the column `data` on table `recipient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `account_id` on table `recipient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipient" ALTER COLUMN "data" SET NOT NULL,
ALTER COLUMN "account_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "auto_message" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "message_template_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "auto_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auto_message" ADD CONSTRAINT "auto_message_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "message_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
