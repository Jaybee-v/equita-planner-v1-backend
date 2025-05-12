/*
  Warnings:

  - You are about to drop the column `targetId` on the `notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_targetId_fkey`;

-- DropIndex
DROP INDEX `Notification_targetId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `targetId`;
