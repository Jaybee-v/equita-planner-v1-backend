/*
  Warnings:

  - You are about to alter the column `type` on the `notification` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(9))` to `Enum(EnumId(12))`.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `type` ENUM('AFFILIATION_REQUEST') NOT NULL DEFAULT 'AFFILIATION_REQUEST';
