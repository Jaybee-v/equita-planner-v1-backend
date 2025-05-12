-- CreateTable
CREATE TABLE `AffiliationRequest` (
    `id` VARCHAR(191) NOT NULL,
    `riderId` VARCHAR(191) NOT NULL,
    `stableId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AffiliationRequest` ADD CONSTRAINT `AffiliationRequest_riderId_fkey` FOREIGN KEY (`riderId`) REFERENCES `Rider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
