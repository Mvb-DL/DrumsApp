-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_teacherId_fkey`;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
