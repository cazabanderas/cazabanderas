CREATE TABLE `activityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamMemberId` int NOT NULL,
	`action` varchar(50) NOT NULL,
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`success` int NOT NULL DEFAULT 1,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLog_id` PRIMARY KEY(`id`)
);
