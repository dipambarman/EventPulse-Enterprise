-- AlterTable
ALTER TABLE `themes` ADD COLUMN `baseGuestCount` INTEGER NULL,
    ADD COLUMN `basePrice` DOUBLE NULL,
    ADD COLUMN `pricePerExtraGuest` DOUBLE NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    ADD COLUMN `venueDiscountAmount` DOUBLE NULL;
