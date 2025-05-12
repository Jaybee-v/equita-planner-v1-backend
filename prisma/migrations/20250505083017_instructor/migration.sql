-- AlterTable
ALTER TABLE `user` ADD COLUMN `isIndependentInstructor` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `role` ENUM('STABLE', 'RIDER', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STABLE';

-- CreateTable
CREATE TABLE `Instructor` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `isIndependent` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `familyName` VARCHAR(191) NOT NULL,
    `gender` ENUM('M', 'F', 'N') NOT NULL DEFAULT 'N',
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Instructor_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Instructor` ADD CONSTRAINT `Instructor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
