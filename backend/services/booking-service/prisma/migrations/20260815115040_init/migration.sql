/*
  Warnings:

  - You are about to drop the column `customer_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `booking_statuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_status_id_fkey`;

-- DropIndex
DROP INDEX `bookings_customer_id_fkey` ON `bookings`;

-- DropIndex
DROP INDEX `bookings_status_id_fkey` ON `bookings`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `customer_id`,
    DROP COLUMN `status_id`,
    ADD COLUMN `cancellation_details` TEXT NULL,
    ADD COLUMN `customer_email` VARCHAR(191) NULL,
    ADD COLUMN `customer_name` VARCHAR(191) NULL,
    ADD COLUMN `customer_phone` VARCHAR(191) NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    MODIFY `start_date` DATE NOT NULL,
    MODIFY `end_date` DATE NOT NULL,
    MODIFY `total_price` DECIMAL(10, 2) NOT NULL,
    MODIFY `guest_count` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `booking_statuses`;

-- DropTable
DROP TABLE `customers`;

-- CreateTable
CREATE TABLE `add_ons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_add_ons` (
    `booking_id` VARCHAR(191) NOT NULL,
    `add_on_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price_at_booking` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`booking_id`, `add_on_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `bookings_start_date_end_date_idx` ON `bookings`(`start_date`, `end_date`);

-- AddForeignKey
ALTER TABLE `booking_add_ons` ADD CONSTRAINT `booking_add_ons_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_add_ons` ADD CONSTRAINT `booking_add_ons_add_on_id_fkey` FOREIGN KEY (`add_on_id`) REFERENCES `add_ons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
