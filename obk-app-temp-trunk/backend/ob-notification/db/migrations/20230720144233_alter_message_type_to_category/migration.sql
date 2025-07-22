-- DropForeignKey
ALTER TABLE "message_template" RENAME COLUMN "message_type_id" to "message_category_id";

-- AlterTable
ALTER TABLE IF EXISTS "message_type" RENAME TO "message_category";

-- AlterTable
ALTER TABLE "message_category" RENAME CONSTRAINT "message_type_pkey" TO "message_category_pkey";

-- AddForeignKey
ALTER TABLE "message_template" RENAME CONSTRAINT "message_template_message_type_id_fkey" TO "message_template_message_category_id_fkey";


