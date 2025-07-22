-- CreateTable
CREATE TABLE "icon" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "icon_pkey" PRIMARY KEY ("id")
);
