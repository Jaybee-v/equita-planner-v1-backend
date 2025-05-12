/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Stable` will be added. If there are existing duplicate values, this will fail.
  - The required column `slug` was added to the `Stable` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `stable` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Stable_slug_key` ON `Stable`(`slug`);
