/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,parentId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Folder_name_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_userId_parentId_key" ON "Folder"("name", "userId", "parentId");
