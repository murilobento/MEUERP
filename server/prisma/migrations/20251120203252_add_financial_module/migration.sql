/*
  Warnings:

  - You are about to drop the column `category` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `category`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `transaction_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `transaction_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
