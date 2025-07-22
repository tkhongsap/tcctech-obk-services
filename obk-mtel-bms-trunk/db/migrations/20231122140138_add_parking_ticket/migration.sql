-- CreateTable
CREATE TABLE "parking_ticket" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "plate_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "parking_ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parking_ticket" ADD CONSTRAINT "parking_ticket_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
