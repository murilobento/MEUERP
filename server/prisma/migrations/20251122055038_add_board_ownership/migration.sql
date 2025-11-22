/*
  Warnings:

  - Added the required column `ownerId` to the `boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `boards` ADD COLUMN `ownerId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_BoardMembers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BoardMembers_AB_unique`(`A`, `B`),
    INDEX `_BoardMembers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `boards` ADD CONSTRAINT `boards_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BoardMembers` ADD CONSTRAINT `_BoardMembers_A_fkey` FOREIGN KEY (`A`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BoardMembers` ADD CONSTRAINT `_BoardMembers_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
