/*
  Warnings:

  - Added the required column `latitude` to the `Stable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Stable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stable` ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL;
