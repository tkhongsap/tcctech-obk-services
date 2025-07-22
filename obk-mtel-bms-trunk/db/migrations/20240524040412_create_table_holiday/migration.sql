-- CreateTable
CREATE TABLE "holiday" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "holiday_week_day" TEXT NOT NULL,
    "holiday_week_day_thai" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "date_thai" TEXT NOT NULL,
    "holiday_description" TEXT NOT NULL,
    "holiday_description_thai" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holiday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "holiday_date_key" ON "holiday"("date");
