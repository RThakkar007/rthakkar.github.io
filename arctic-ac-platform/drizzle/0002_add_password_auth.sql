-- Migration: Add email/password auth support
-- Makes openId nullable and adds passwordHash + unique email index

ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64) NULL;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `passwordHash` varchar(255) NULL;

-- Add unique index on email if not already present
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NULL;
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);
