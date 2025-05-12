-- AlterTable
ALTER TABLE `activityparticipant` ADD COLUMN `validationOption` ENUM('AUTOMATIC', 'MANUAL') NOT NULL DEFAULT 'AUTOMATIC';
