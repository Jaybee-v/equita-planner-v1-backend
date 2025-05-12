-- AlterTable
ALTER TABLE `rider` ADD COLUMN `gender` ENUM('M', 'F', 'N') NOT NULL DEFAULT 'N';
