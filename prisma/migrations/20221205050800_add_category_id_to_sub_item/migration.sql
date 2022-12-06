/*
  Warnings:

  - Added the required column `categoryId` to the `SubItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SubItem` ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;
