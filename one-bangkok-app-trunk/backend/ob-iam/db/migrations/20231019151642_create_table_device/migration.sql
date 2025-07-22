-- CreateTable
CREATE TABLE "device" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "account_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "device_id_created_at_idx" ON "device"("id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "device_account_id_created_at_idx" ON "device"("account_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "device_device_id_created_at_idx" ON "device"("device_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "device" ADD CONSTRAINT "device_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
