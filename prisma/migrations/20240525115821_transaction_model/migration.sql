-- CreateTable
CREATE TABLE `Transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `block` INTEGER NOT NULL,
    `age` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transactions_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
