-- CreateTable
CREATE TABLE "message_transaction" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_transaction" ADD CONSTRAINT "message_transaction_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
