/*
  Warnings:

  - Added the required column `max_fee` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nonce` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_address` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signature` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `max_fee` VARCHAR(191) NOT NULL,
    ADD COLUMN `nonce` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `signature` JSON NOT NULL,
    ADD COLUMN `version` VARCHAR(191) NOT NULL;
