-- AlterTable
ALTER TABLE `admin` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'customer';

-- AlterTable
ALTER TABLE `student` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'student';

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'teacher';
