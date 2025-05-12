-- CreateTable
CREATE TABLE `Activity` (
    `id` VARCHAR(191) NOT NULL,
    `stableId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `type` ENUM('PUBLIC', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC',
    `visibility` ENUM('MEMBERS', 'PUBLIC', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC',
    `requiredLevel` ENUM('BEGINNER', 'GALOP_1', 'GALOP_2', 'GALOP_3', 'GALOP_4', 'GALOP_5', 'GALOP_6', 'GALOP_7', 'ALL') NULL,
    `maxParticipants` INTEGER NULL,
    `createdBy` ENUM('STABLE', 'RIDER') NOT NULL DEFAULT 'STABLE',
    `createdFromRequestId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `activityId` VARCHAR(191) NOT NULL,
    `riderId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SlotRequest` (
    `id` VARCHAR(191) NOT NULL,
    `stableId` VARCHAR(191) NOT NULL,
    `riderId` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `preferredDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_stableId_fkey` FOREIGN KEY (`stableId`) REFERENCES `Stable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityParticipant` ADD CONSTRAINT `ActivityParticipant_riderId_fkey` FOREIGN KEY (`riderId`) REFERENCES `Rider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityParticipant` ADD CONSTRAINT `ActivityParticipant_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlotRequest` ADD CONSTRAINT `SlotRequest_riderId_fkey` FOREIGN KEY (`riderId`) REFERENCES `Rider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlotRequest` ADD CONSTRAINT `SlotRequest_stableId_fkey` FOREIGN KEY (`stableId`) REFERENCES `Stable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
