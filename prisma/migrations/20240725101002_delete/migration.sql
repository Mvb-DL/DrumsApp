-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_partId_fkey`;

-- DropForeignKey
ALTER TABLE `mix` DROP FOREIGN KEY `Mix_soloId_fkey`;

-- DropForeignKey
ALTER TABLE `part` DROP FOREIGN KEY `Part_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `solo` DROP FOREIGN KEY `Solo_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `studentpart` DROP FOREIGN KEY `StudentPart_partId_fkey`;

-- DropForeignKey
ALTER TABLE `track` DROP FOREIGN KEY `Track_mixId_fkey`;

-- AddForeignKey
ALTER TABLE `Part` ADD CONSTRAINT `Part_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPart` ADD CONSTRAINT `StudentPart_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `Part`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `Part`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solo` ADD CONSTRAINT `Solo_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mix` ADD CONSTRAINT `Mix_soloId_fkey` FOREIGN KEY (`soloId`) REFERENCES `Solo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_mixId_fkey` FOREIGN KEY (`mixId`) REFERENCES `Mix`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
