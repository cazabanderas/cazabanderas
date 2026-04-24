CREATE TABLE `htbTeamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`htbUserId` int NOT NULL,
	`htbUsername` varchar(255) NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`profilePictureUrl` text,
	`isVisible` int NOT NULL DEFAULT 1,
	`notes` text,
	`syncedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `htbTeamMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `htbTeamMembers_htbUserId_unique` UNIQUE(`htbUserId`)
);
