-- CreateIndex
CREATE INDEX "otp_identifier_created_at_idx" ON "otp"("identifier", "created_at" DESC);
