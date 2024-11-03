/*
  Warnings:

  - You are about to drop the column `Name` on the `storage_locations` table. All the data in the column will be lost.
  - Added the required column `name` to the `storage_locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "storage_locations" DROP COLUMN "Name",
ADD COLUMN     "name" TEXT NOT NULL;
