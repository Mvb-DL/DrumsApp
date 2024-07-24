-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Teacher_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `trackId` VARCHAR(191) NOT NULL,
    `teacherId` INTEGER NOT NULL,

    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Part` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `previousPartId` INTEGER NULL,
    `currentPartId` INTEGER NULL,
    `nextPartId` INTEGER NULL,
    `studentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `previousLessonId` INTEGER NULL,
    `currentLessonId` INTEGER NULL,
    `nextLessonId` INTEGER NULL,
    `partId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Solo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `previousSoloId` INTEGER NULL,
    `currentSoloId` INTEGER NULL,
    `nextSoloId` INTEGER NULL,
    `level` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mix` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `previousMixId` INTEGER NULL,
    `currentMixId` INTEGER NULL,
    `nextMixId` INTEGER NULL,
    `level` INTEGER NOT NULL,
    `soloId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Track` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `previousTrackId` INTEGER NULL,
    `currentTrack` VARCHAR(191) NOT NULL,
    `nextTrackId` INTEGER NULL,
    `trackLevelId` INTEGER NOT NULL,
    `mixId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bpm` INTEGER NOT NULL,
    `instruments` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrackHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `trackId` VARCHAR(191) NOT NULL,
    `studentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Part` ADD CONSTRAINT `Part_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Part` ADD CONSTRAINT `Part_previousPartId_fkey` FOREIGN KEY (`previousPartId`) REFERENCES `Part`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Part` ADD CONSTRAINT `Part_nextPartId_fkey` FOREIGN KEY (`nextPartId`) REFERENCES `Part`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `Part`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_previousLessonId_fkey` FOREIGN KEY (`previousLessonId`) REFERENCES `Lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_nextLessonId_fkey` FOREIGN KEY (`nextLessonId`) REFERENCES `Lesson`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solo` ADD CONSTRAINT `Solo_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solo` ADD CONSTRAINT `Solo_previousSoloId_fkey` FOREIGN KEY (`previousSoloId`) REFERENCES `Solo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solo` ADD CONSTRAINT `Solo_nextSoloId_fkey` FOREIGN KEY (`nextSoloId`) REFERENCES `Solo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mix` ADD CONSTRAINT `Mix_soloId_fkey` FOREIGN KEY (`soloId`) REFERENCES `Solo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mix` ADD CONSTRAINT `Mix_previousMixId_fkey` FOREIGN KEY (`previousMixId`) REFERENCES `Mix`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mix` ADD CONSTRAINT `Mix_nextMixId_fkey` FOREIGN KEY (`nextMixId`) REFERENCES `Mix`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_trackLevelId_fkey` FOREIGN KEY (`trackLevelId`) REFERENCES `TrackLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_mixId_fkey` FOREIGN KEY (`mixId`) REFERENCES `Mix`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_previousTrackId_fkey` FOREIGN KEY (`previousTrackId`) REFERENCES `Track`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_nextTrackId_fkey` FOREIGN KEY (`nextTrackId`) REFERENCES `Track`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrackHistory` ADD CONSTRAINT `TrackHistory_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
