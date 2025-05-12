/*
  Warnings:

  - You are about to drop the column `preferredDate` on the `slotrequest` table. All the data in the column will be lost.
  - Added the required column `preferredEndDate` to the `SlotRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredStartDate` to the `SlotRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `slotrequest` DROP COLUMN `preferredDate`,
    ADD COLUMN `preferredEndDate` DATETIME(3) NOT NULL,
    ADD COLUMN `preferredStartDate` DATETIME(3) NOT NULL;
