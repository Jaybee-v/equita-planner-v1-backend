/*
  Warnings:

  - The values [RIDER] on the enum `Activity_createdBy` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `activity` MODIFY `createdBy` ENUM('STABLE', 'SYSTEM') NOT NULL DEFAULT 'STABLE';
