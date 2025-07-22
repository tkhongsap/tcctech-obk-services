-- AlterTable
ALTER TABLE "notification_group" ADD COLUMN     "display_name" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "setting_email_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "setting_in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "setting_push_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "setting_sms_enabled" BOOLEAN NOT NULL DEFAULT true;
