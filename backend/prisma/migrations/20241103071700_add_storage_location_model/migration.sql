/*
  Warnings:

  - You are about to drop the column `location` on the `stakings` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `storages` table. All the data in the column will be lost.
  - Added the required column `storageLocationId` to the `stakings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageLocationId` to the `storages` table without a default value. This is not possible if the table is not empty.

*/
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
    "Name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "storage_locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "storages" ADD CONSTRAINT "storages_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakings" ADD CONSTRAINT "stakings_storageLocationId_fkey" FOREIGN KEY ("storageLocationId") REFERENCES "storage_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
