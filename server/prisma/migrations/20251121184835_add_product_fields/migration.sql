-- AlterTable
ALTER TABLE `products` ADD COLUMN `barcode` VARCHAR(191) NULL,
    ADD COLUMN `height` DECIMAL(10, 2) NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `length` DECIMAL(10, 2) NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `supplierId` INTEGER NULL,
    ADD COLUMN `weight` DECIMAL(10, 2) NULL,
    ADD COLUMN `width` DECIMAL(10, 2) NULL,
    MODIFY `code` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
