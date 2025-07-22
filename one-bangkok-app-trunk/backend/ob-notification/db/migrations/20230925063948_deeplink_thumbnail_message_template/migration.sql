-- AlterTable
ALTER TABLE "message" DROP COLUMN "deeplink";

-- AlterTable
ALTER TABLE "message_template" ADD COLUMN     "deeplink" TEXT,
ADD COLUMN     "thumbnail" TEXT;
 
-- CreateIndex
CREATE INDEX IF NOT EXISTS "message_recipient_id_read_idx" ON "message"("recipient_id", "read");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "message_recipient_id_idx" ON "message"("recipient_id");
