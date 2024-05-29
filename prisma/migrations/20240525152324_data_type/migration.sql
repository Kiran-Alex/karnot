/*
  Warnings:

  - Changed the type of `age` on the `Transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Transactions` DROP COLUMN `age`,
    ADD COLUMN `age` INTEGER NOT NULL;
