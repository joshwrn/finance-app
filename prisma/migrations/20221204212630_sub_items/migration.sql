/*
  Warnings:

  - You are about to alter the column `price` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to drop the column `categoryId` on the `SubItem` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `SubItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - Made the column `itemId` on table `SubItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Item` MODIFY `price` INTEGER NULL;

-- AlterTable
ALTER TABLE `SubItem` DROP COLUMN `categoryId`,
    MODIFY `price` INTEGER NULL,
    MODIFY `itemId` VARCHAR(191) NOT NULL;
