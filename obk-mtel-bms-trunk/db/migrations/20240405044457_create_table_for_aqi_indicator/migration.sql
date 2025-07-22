-- CreateTable
CREATE TABLE "air_quality_index" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "display_name" JSON NOT NULL DEFAULT '{}',
    "short_description" JSON NOT NULL DEFAULT '{}',
    "description" JSON NOT NULL DEFAULT '{}',
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "air_quality_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "air_quality_index_indicator" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "air_quality_index_id" TEXT NOT NULL,
    "title" JSON NOT NULL DEFAULT '{}',
    "description" JSON NOT NULL DEFAULT '{}',
    "sequence" INTEGER NOT NULL,
    "color_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "air_quality_index_indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "air_quality_index_indicator_range" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "air_quality_index_indicator_id" TEXT NOT NULL,
    "title" JSON NOT NULL DEFAULT '{}',
    "min_value" DOUBLE PRECISION,
    "max_value" DOUBLE PRECISION,
    "min_display" TEXT NOT NULL,
    "max_display" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "air_quality_index_indicator_range_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "air_quality_index_indicator" ADD CONSTRAINT "air_quality_index_indicator_air_quality_index_id_fkey" FOREIGN KEY ("air_quality_index_id") REFERENCES "air_quality_index"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "air_quality_index_indicator_range" ADD CONSTRAINT "air_quality_index_indicator_range_air_quality_index_indica_fkey" FOREIGN KEY ("air_quality_index_indicator_id") REFERENCES "air_quality_index_indicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
