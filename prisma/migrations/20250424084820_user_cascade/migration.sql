-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_stableId_fkey`;

-- DropForeignKey
ALTER TABLE `affiliationrequest` DROP FOREIGN KEY `AffiliationRequest_riderId_fkey`;

-- DropForeignKey
ALTER TABLE `affiliationrequest` DROP FOREIGN KEY `AffiliationRequest_stableId_fkey`;

-- DropForeignKey
ALTER TABLE `rider` DROP FOREIGN KEY `Rider_userId_fkey`;

-- DropForeignKey
ALTER TABLE `stable` DROP FOREIGN KEY `Stable_userId_fkey`;

-- DropIndex
DROP INDEX `AffiliationRequest_riderId_fkey` ON `affiliationrequest`;

-- DropIndex
DROP INDEX `AffiliationRequest_stableId_fkey` ON `affiliationrequest`;

-- AddForeignKey
ALTER TABLE `Rider` ADD CONSTRAINT `Rider_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stable` ADD CONSTRAINT `Stable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AffiliationRequest` ADD CONSTRAINT `AffiliationRequest_riderId_fkey` FOREIGN KEY (`riderId`) REFERENCES `Rider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AffiliationRequest` ADD CONSTRAINT `AffiliationRequest_stableId_fkey` FOREIGN KEY (`stableId`) REFERENCES `Stable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_stableId_fkey` FOREIGN KEY (`stableId`) REFERENCES `Stable`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
