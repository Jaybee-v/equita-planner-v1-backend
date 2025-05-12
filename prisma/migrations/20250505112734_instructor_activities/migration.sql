-- AlterTable
ALTER TABLE `activity` ADD COLUMN `instructorId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
