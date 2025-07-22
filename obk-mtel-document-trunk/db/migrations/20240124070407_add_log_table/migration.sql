-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "version" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);
