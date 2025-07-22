-- DropForeignKey
ALTER TABLE "campaign" DROP CONSTRAINT "campaign_message_template_id_fkey";

-- AlterTable
ALTER TABLE "campaign" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "message_template_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
