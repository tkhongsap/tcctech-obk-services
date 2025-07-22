-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "submitted_by" TEXT DEFAULT '-',
ADD COLUMN     "updated_by" TEXT DEFAULT '-';

-- AlterTable
ALTER TABLE "campaign_target_group" ADD COLUMN     "message_templateId" TEXT;

-- AddForeignKey
ALTER TABLE "campaign_target_group" ADD CONSTRAINT "campaign_target_group_message_templateId_fkey" FOREIGN KEY ("message_templateId") REFERENCES "message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
