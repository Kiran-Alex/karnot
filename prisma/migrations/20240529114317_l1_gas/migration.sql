/*
  Warnings:

  - Added the required column `l1_gas_price` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `l1_gas_price` VARCHAR(191) NOT NULL;
