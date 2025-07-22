-- CreateTable
CREATE TABLE "store_whitelists" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "tax_id" TEXT,
    "store_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "unit_no" TEXT,
    "address" TEXT,
    "building" TEXT,
    "has_tax_id" BOOLEAN NOT NULL,
    "receipt_address_in_obk" BOOLEAN NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "store_whitelists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "malls" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "malls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mall_addresses" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "mall_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "keyword" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_name_key" ON "properties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "malls_name_key" ON "malls"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mall_addresses_address_key" ON "mall_addresses"("address");

-- AddForeignKey
ALTER TABLE "store_whitelists" ADD CONSTRAINT "store_whitelists_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
