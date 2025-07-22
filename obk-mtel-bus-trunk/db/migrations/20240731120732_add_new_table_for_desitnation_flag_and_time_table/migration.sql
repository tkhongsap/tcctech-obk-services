-- CreateTable
CREATE TABLE "destination_flags" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "destination_id" TEXT NOT NULL,
    "name" JSON NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destination_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_tables" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "destination_id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_tables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "destination_flags_id_idx" ON "destination_flags"("id");

-- CreateIndex
CREATE INDEX "time_tables_id_idx" ON "time_tables"("id");
