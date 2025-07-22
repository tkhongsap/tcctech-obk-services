-- AlterTable
ALTER TABLE "message_template" ADD COLUMN     "notification_group_id" TEXT;

-- AddForeignKey
ALTER TABLE "message_template" ADD CONSTRAINT "message_template_notification_group_id_fkey" FOREIGN KEY ("notification_group_id") REFERENCES "notification_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
