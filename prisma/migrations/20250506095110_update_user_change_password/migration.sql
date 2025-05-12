-- AlterTable
ALTER TABLE `notification` ADD COLUMN `sendBy` ENUM('SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    ADD COLUMN `senderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `mustChangePassword` BOOLEAN NOT NULL DEFAULT false;
