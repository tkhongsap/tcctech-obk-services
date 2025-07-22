-- CreateIndex
CREATE INDEX "token_id_value_type_created_at_idx" ON "token"("id", "value", "type", "created_at" DESC);
