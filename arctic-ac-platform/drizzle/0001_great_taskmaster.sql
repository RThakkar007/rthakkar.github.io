CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingRef` varchar(20) NOT NULL,
	`userId` int,
	`guestName` varchar(100),
	`guestEmail` varchar(320),
	`guestPhone` varchar(20),
	`serviceId` int NOT NULL,
	`technicianId` int,
	`zoneId` int,
	`scheduledAt` timestamp NOT NULL,
	`address` text NOT NULL,
	`latitude` float,
	`longitude` float,
	`status` enum('pending','assigned','on_the_way','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`paymentMethod` enum('cod','razorpay') NOT NULL DEFAULT 'cod',
	`paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`totalAmount` decimal(10,2),
	`notes` text,
	`assignmentMethod` enum('gps','zone','manual'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_bookingRef_unique` UNIQUE(`bookingRef`)
);
--> statement-breakpoint
CREATE TABLE `jobUpdates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`status` enum('pending','assigned','on_the_way','in_progress','completed','cancelled') NOT NULL,
	`note` text,
	`photoUrl` text,
	`updatedBy` enum('system','technician','admin') DEFAULT 'system',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobUpdates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientType` enum('customer','technician','admin') NOT NULL,
	`recipientId` int NOT NULL,
	`bookingId` int,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`type` enum('job_assigned','job_accepted','on_the_way','completed','new_booking','payment') NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`method` enum('cod','razorpay') NOT NULL,
	`status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`razorpayOrderId` varchar(100),
	`razorpayPaymentId` varchar(100),
	`razorpaySignature` varchar(255),
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`duration` int NOT NULL,
	`category` varchar(50),
	`icon` varchar(50),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technicians` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`zoneId` int,
	`latitude` float,
	`longitude` float,
	`lastLocationUpdate` timestamp,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`isActive` boolean NOT NULL DEFAULT true,
	`profilePhoto` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `technicians_id` PRIMARY KEY(`id`),
	CONSTRAINT `technicians_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);