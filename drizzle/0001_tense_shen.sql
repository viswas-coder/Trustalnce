CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`freelancerId` int NOT NULL,
	`coverLetter` text NOT NULL,
	`proposedBudget` decimal(10,2),
	`status` enum('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disputes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`filedBy` int NOT NULL,
	`reason` text NOT NULL,
	`evidence` text,
	`status` enum('open','under_review','resolved','closed') NOT NULL DEFAULT 'open',
	`resolution` text,
	`llmAnalysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disputes_id` PRIMARY KEY(`id`),
	CONSTRAINT `disputes_projectId_unique` UNIQUE(`projectId`)
);
--> statement-breakpoint
CREATE TABLE `escrow` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','held','released','refunded','disputed') NOT NULL DEFAULT 'pending',
	`stripePaymentIntentId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `escrow_id` PRIMARY KEY(`id`),
	CONSTRAINT `escrow_projectId_unique` UNIQUE(`projectId`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`dueDate` timestamp NOT NULL,
	`status` enum('pending','in_progress','submitted','approved','rejected') NOT NULL DEFAULT 'pending',
	`deliverableUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`budget` decimal(10,2) NOT NULL,
	`deadline` timestamp NOT NULL,
	`status` enum('open','in_progress','completed','cancelled','disputed') NOT NULL DEFAULT 'open',
	`category` varchar(100),
	`selectedFreelancerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`type` enum('deposit','release','refund','dispute_hold') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`stripeTransactionId` varchar(255),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('client','freelancer','both') DEFAULT 'both';