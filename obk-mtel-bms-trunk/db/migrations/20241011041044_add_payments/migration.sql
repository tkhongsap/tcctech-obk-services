-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "payment_url" TEXT,
    "description" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "invoice_number" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "vat_amount" DOUBLE PRECISION NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3) NOT NULL,
    "meta" JSON NOT NULL DEFAULT '{}',
    "parking_reservation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_number_key" ON "payments"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_invoice_number_key" ON "payments"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_parking_reservation_id_key" ON "payments"("parking_reservation_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_parking_reservation_id_fkey" FOREIGN KEY ("parking_reservation_id") REFERENCES "parking_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
