-- AlterTable
ALTER TABLE `part` ADD COLUMN `studentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Part` ADD CONSTRAINT `Part_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
