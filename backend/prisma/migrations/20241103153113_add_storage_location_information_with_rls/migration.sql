/*
  Warnings:

  - You are about to drop the column `location` on the `stakings` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `storages` table. All the data in the column will be lost.
  - Added the required column `coinId` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `investments` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `investments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `storageLocationId` to the `stakings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageLocationId` to the `storages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageLocationType" AS ENUM ('hardwareWallet', 'softwareWallet', 'exchange');

-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "coinId" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "stakings" DROP COLUMN "location",
ADD COLUMN     "storageLocationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "storages" DROP COLUMN "location",
ADD COLUMN     "storageLocationId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "storage_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT (current_setting('app.current_user_id'::text))::uuid,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "storageLocationType" "StorageLocationType" NOT NULL,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "storages" ADD CONSTRAINT "storages_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakings" ADD CONSTRAINT "stakings_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Enable Row Level Security
ALTER TABLE "storage_locations" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "storage_locations" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "storage_locations" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);

-- Create policies to bypass RLS (optional)
CREATE POLICY bypass_rls_policy ON "storage_locations" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
