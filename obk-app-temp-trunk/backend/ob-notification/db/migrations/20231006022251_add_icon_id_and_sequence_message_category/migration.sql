/*
  Warnings:

  - Added the required column `icon_id` to the `message_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `message_category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message_category" ADD COLUMN     "icon_id" TEXT NOT NULL,
ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "message_category" ADD CONSTRAINT "message_category_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "icon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
