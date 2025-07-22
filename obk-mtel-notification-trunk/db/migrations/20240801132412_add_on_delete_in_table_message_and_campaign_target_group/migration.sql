-- DropForeignKey
ALTER TABLE "campaign_target_group" DROP CONSTRAINT "campaign_target_group_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_message_template_id_fkey";

-- AddForeignKey
ALTER TABLE "campaign_target_group" ADD CONSTRAINT "campaign_target_group_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_message_template_id_fkey" FOREIGN KEY ("message_template_id") REFERENCES "message_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
