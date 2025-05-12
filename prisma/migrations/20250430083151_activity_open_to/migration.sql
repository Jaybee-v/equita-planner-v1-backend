-- AlterTable
ALTER TABLE `activity` ADD COLUMN `openToMoreLevel` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `openToPublic` BOOLEAN NOT NULL DEFAULT false;
