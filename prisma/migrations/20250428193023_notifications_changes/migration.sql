-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropIndex
DROP INDEX `Notification_userId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `targetId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
