/*
  Warnings:

  - Added the required column `image` to the `investments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "image" TEXT NOT NULL;
