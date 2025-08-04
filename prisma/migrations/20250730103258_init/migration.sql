/*
  Warnings:

  - Added the required column `address` to the `Debtor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debtor" ADD COLUMN     "address" TEXT NOT NULL;
