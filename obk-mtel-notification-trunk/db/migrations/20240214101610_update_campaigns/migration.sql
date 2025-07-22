/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "push_notification_data" JSON,
ADD COLUMN     "scheduled_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "message_template" ADD COLUMN     "adhoc" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "campaign_target_group" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "campaign_id" TEXT NOT NULL,
    "target_group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_target_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target_group" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "target_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target_group_member" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "recipient_id" TEXT NOT NULL,
    "target_group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "target_group_member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "campaign_target_group" ADD CONSTRAINT "campaign_target_group_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_target_group" ADD CONSTRAINT "campaign_target_group_target_group_id_fkey" FOREIGN KEY ("target_group_id") REFERENCES "target_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_group_member" ADD CONSTRAINT "target_group_member_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_group_member" ADD CONSTRAINT "target_group_member_target_group_id_fkey" FOREIGN KEY ("target_group_id") REFERENCES "target_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
