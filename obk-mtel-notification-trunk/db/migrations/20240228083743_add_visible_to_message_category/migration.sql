-- DropForeignKey
ALTER TABLE "message_category" DROP CONSTRAINT "message_category_icon_id_fkey";

-- AlterTable
ALTER TABLE "message_category" ADD COLUMN     "remark" TEXT,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "icon_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "message_category" ADD CONSTRAINT "message_category_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "icon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
