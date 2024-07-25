/*
  Warnings:

  - You are about to drop the column `studentId` on the `part` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `part` DROP FOREIGN KEY `Part_studentId_fkey`;

-- AlterTable
ALTER TABLE `part` DROP COLUMN `studentId`;

-- CreateTable
CREATE TABLE `StudentPart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NULL,
    `partId` INTEGER NOT NULL,

    UNIQUE INDEX `StudentPart_studentId_partId_key`(`studentId`, `partId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentPart` ADD CONSTRAINT `StudentPart_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPart` ADD CONSTRAINT `StudentPart_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `Part`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
