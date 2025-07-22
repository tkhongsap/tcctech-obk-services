-- CreateTable
CREATE TABLE "parking_log" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "type" "AccessorType" NOT NULL,
    "status" INTEGER NOT NULL,
    "terminal_id" TEXT NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "data" JSON NOT NULL DEFAULT '{}',
    "name" TEXT,
    "display_status" TEXT,
    "display_termianl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building_access_log" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "uid" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "type" "AccessorType" NOT NULL,
    "status" INTEGER NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "turnstile_id" TEXT NOT NULL,
    "data" JSON NOT NULL DEFAULT '{}',
    "name" TEXT,
    "display_status" TEXT,
    "display_tower" TEXT,
    "display_turnstile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "building_access_log_pkey" PRIMARY KEY ("id")
);
