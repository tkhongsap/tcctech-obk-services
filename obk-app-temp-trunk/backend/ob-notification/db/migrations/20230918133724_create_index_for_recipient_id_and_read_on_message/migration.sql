CREATE INDEX "message_recipient_id_idx" ON "message"("recipient_id");
CREATE INDEX "message_recipient_id_read_idx" ON "message"("recipient_id", "read");
