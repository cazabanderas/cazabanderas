CREATE TABLE `teamCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`passwordHash` text NOT NULL,
	`teamMemberId` int NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamCredentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `teamCredentials_username_unique` UNIQUE(`username`)
);
