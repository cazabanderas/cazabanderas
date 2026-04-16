CREATE TABLE `teamWriteups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamMemberId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`challengeName` varchar(255),
	`platform` varchar(100),
	`difficulty` varchar(50),
	`category` varchar(255),
	`isPublic` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamWriteups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `teamWriteups` ADD CONSTRAINT `teamWriteups_teamMemberId_teamMembers_id_fk` FOREIGN KEY (`teamMemberId`) REFERENCES `teamMembers`(`id`) ON DELETE cascade ON UPDATE no action;