-- AlterTable
ALTER TABLE `sales` ADD COLUMN `paymentMethod` ENUM('DEBIT_CARD', 'CREDIT_CARD', 'CASH', 'PIX', 'BOLETO') NULL;
