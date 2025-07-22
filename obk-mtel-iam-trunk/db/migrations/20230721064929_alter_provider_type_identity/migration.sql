/*
  Warnings:

  - Changed the type of `provider` on the `identity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('email', 'phone', 'sso');

ALTER TABLE "identity" ALTER COLUMN "provider" TYPE "IdentityProvider" USING "provider"::"IdentityProvider";