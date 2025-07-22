-- CreateTable
CREATE TABLE "key_pair" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "public" TEXT NOT NULL,
    "private" TEXT NOT NULL,
    "api_key_id" TEXT NOT NULL,

    CONSTRAINT "key_pair_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "key_pair" ADD CONSTRAINT "key_pair_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE CASCADE ON UPDATE CASCADE;
