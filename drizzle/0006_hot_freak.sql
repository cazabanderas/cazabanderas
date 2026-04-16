CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`label` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isVisible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `achievements_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `platforms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`abbreviation` varchar(50) NOT NULL,
	`ranking` text NOT NULL,
	`description` text,
	`tags` varchar(500),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isVisible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platforms_id` PRIMARY KEY(`id`)
);
