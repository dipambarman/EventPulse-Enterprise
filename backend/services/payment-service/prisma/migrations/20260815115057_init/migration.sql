/*
  Warnings:

  - You are about to drop the column `method_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `status_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `payment_methods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_statuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_method_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_status_id_fkey`;

-- DropIndex
DROP INDEX `payments_method_id_fkey` ON `payments`;

-- DropIndex
DROP INDEX `payments_status_id_fkey` ON `payments`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `method_id`,
    DROP COLUMN `status_id`,
    ADD COLUMN `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `payment_method` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    MODIFY `amount` DECIMAL(10, 2) NOT NULL;

-- DropTable
DROP TABLE `payment_methods`;

-- DropTable
DROP TABLE `payment_statuses`;

-- CreateIndex
CREATE INDEX `payments_status_idx` ON `payments`(`status`);
