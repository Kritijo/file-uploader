/*
  Warnings:

  - You are about to drop the column `createdAt` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "createdAt";
