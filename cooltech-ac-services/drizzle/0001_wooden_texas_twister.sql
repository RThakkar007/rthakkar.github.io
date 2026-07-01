CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingRef` varchar(20) NOT NULL,
	`userId` int NOT NULL,
	`technicianId` int,
	`serviceId` int NOT NULL,
	`status` enum('pending','confirmed','assigned','en_route','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`scheduledDate` varchar(20) NOT NULL,
	`scheduledTime` varchar(10) NOT NULL,
	`address` text NOT NULL,
	`city` varchar(100),
	`totalAmount` decimal(10,2) NOT NULL,
	`paymentStatus` enum('pending','paid','refunded') DEFAULT 'pending',
	`stripePaymentIntentId` varchar(200),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_bookingRef_unique` UNIQUE(`bookingRef`)
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(100) NOT NULL,
	`serviceId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int,
	`userId` int NOT NULL,
	`technicianId` int,
	`serviceId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`authorName` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` enum('cleaning','repair','installation','gas') NOT NULL,
	`description` text,
	`basePrice` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`durationMinutes` int NOT NULL,
	`unit` varchar(50) DEFAULT 'per service',
	`acCount` int DEFAULT 1,
	`rating` decimal(3,2) DEFAULT '4.75',
	`reviewCount` int DEFAULT 0,
	`isPopular` boolean DEFAULT false,
	`imageUrl` text,
	`highlights` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `technician_locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`technicianId` int NOT NULL,
	`latitude` float NOT NULL,
	`longitude` float NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `technician_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technicians` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(20),
	`email` varchar(320),
	`photoUrl` text,
	`rating` decimal(3,2) DEFAULT '4.80',
	`reviewCount` int DEFAULT 0,
	`yearsExperience` int DEFAULT 1,
	`isVerified` boolean DEFAULT true,
	`isAvailable` boolean DEFAULT true,
	`specializations` text,
	`latitude` float,
	`longitude` float,
	`bio` text,
	`completedJobs` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `technicians_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;