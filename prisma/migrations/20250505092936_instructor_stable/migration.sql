-- AlterTable
ALTER TABLE `instructor` ADD COLUMN `picture` VARCHAR(191) NULL,
    ADD COLUMN `stableId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Instructor` ADD CONSTRAINT `Instructor_stableId_fkey` FOREIGN KEY (`stableId`) REFERENCES `Stable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
