-- CreateTable
CREATE TABLE `Stable` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `picture1` VARCHAR(191) NULL,
    `picture2` VARCHAR(191) NULL,
    `picture3` VARCHAR(191) NULL,
    `numStreet` INTEGER NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Stable_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stable` ADD CONSTRAINT `Stable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AffiliationRequest` ADD CONSTRAINT `AffiliationRequest_stableId_fkey` FOREIGN KEY (`stableId`) REFERENCES `Stable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
