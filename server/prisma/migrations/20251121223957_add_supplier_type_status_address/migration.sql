/*
  Warnings:

  - You are about to drop the column `address` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `address`,
    ADD COLUMN `complement` VARCHAR(191) NULL,
    ADD COLUMN `neighborhood` VARCHAR(191) NULL,
    ADD COLUMN `number` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `street` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('INDIVIDUAL', 'COMPANY') NOT NULL DEFAULT 'COMPANY';
