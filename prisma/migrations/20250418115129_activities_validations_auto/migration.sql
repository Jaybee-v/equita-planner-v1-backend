/*
  Warnings:

  - You are about to drop the column `validationOption` on the `activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activity` DROP COLUMN `validationOption`,
    ADD COLUMN `validationParticipantOption` ENUM('AUTOMATIC', 'MANUAL') NOT NULL DEFAULT 'AUTOMATIC';
