/*
  Warnings:

  - Made the column `userId` on table `investments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "coinId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;
