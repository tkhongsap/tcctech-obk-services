-- CreateIndex
CREATE INDEX "otp_reference_created_at_idx" ON "otp"("reference", "created_at" DESC);
