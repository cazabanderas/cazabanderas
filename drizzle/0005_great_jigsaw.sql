CREATE TABLE `huntersProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamMemberId` int NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`title` varchar(255),
	`bio` text,
	`specialty` varchar(100),
	`avatarUrl` text,
	`htbProfile` text,
	`thmProfile` text,
	`githubProfile` text,
	`twitterProfile` text,
	`flagsCount` int NOT NULL DEFAULT 0,
	`ranking` int,
	`isVisible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `huntersProfiles_id` PRIMARY KEY(`id`)
);
