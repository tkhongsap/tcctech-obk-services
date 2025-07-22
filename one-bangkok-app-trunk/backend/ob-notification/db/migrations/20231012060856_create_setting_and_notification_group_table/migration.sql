-- CreateTable
CREATE TABLE "notification_group" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "notification_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "recipient_id" TEXT NOT NULL,
    "notification_group_id" TEXT NOT NULL,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting" ADD CONSTRAINT "setting_notification_group_id_fkey" FOREIGN KEY ("notification_group_id") REFERENCES "notification_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
