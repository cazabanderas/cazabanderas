CREATE TABLE `completedChallenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengeName` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`htbChallengeId` varchar(100),
	`difficulty` varchar(50),
	`points` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `completedChallenges_id` PRIMARY KEY(`id`),
	CONSTRAINT `completedChallenges_challengeName_unique` UNIQUE(`challengeName`)
);
