/*
  Warnings:

  - You are about to drop the column `validationOption` on the `activityparticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `validationOption` ENUM('AUTOMATIC', 'MANUAL') NOT NULL DEFAULT 'AUTOMATIC';

-- AlterTable
ALTER TABLE `activityparticipant` DROP COLUMN `validationOption`;
