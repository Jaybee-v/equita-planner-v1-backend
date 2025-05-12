-- CreateTable
CREATE TABLE `Rider` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `familyName` VARCHAR(191) NOT NULL,
    `level` ENUM('BEGINNER', 'GALOP_1', 'GALOP_2', 'GALOP_3', 'GALOP_4', 'GALOP_5', 'GALOP_6', 'GALOP_7', 'ALL') NOT NULL DEFAULT 'BEGINNER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Rider_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rider` ADD CONSTRAINT `Rider_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
