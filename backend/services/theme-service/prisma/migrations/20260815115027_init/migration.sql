/*
  Warnings:

  - You are about to drop the column `baseGuestCount` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `basePrice` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerExtraGuest` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `venueDiscountAmount` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the `add_ons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `themes` DROP FOREIGN KEY `themes_category_id_fkey`;

-- DropIndex
DROP INDEX `themes_category_id_fkey` ON `themes`;

-- AlterTable
ALTER TABLE `themes` DROP COLUMN `baseGuestCount`,
    DROP COLUMN `basePrice`,
    DROP COLUMN `category_id`,
    DROP COLUMN `pricePerExtraGuest`,
    DROP COLUMN `status`,
    DROP COLUMN `venueDiscountAmount`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `description` TEXT NULL;

-- DropTable
DROP TABLE `add_ons`;

-- DropTable
DROP TABLE `categories`;

-- CreateTable
CREATE TABLE `theme_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `theme_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theme_category_mapping` (
    `theme_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`theme_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `theme_category_mapping` ADD CONSTRAINT `theme_category_mapping_theme_id_fkey` FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `theme_category_mapping` ADD CONSTRAINT `theme_category_mapping_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `theme_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
