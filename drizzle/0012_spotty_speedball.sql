CREATE TABLE `leaderboardStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`htbTeamMemberId` int NOT NULL,
	`totalFlags` int NOT NULL DEFAULT 0,
	`totalChallenges` int NOT NULL DEFAULT 0,
	`totalPoints` int NOT NULL DEFAULT 0,
	`rankPosition` int,
	`tier` varchar(50) NOT NULL DEFAULT 'bronze',
	`previousRankPosition` int,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboardStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboardStats_htbTeamMemberId_unique` UNIQUE(`htbTeamMemberId`)
);
--> statement-breakpoint
ALTER TABLE `leaderboardStats` ADD CONSTRAINT `leaderboardStats_htbTeamMemberId_htbTeamMembers_id_fk` FOREIGN KEY (`htbTeamMemberId`) REFERENCES `htbTeamMembers`(`id`) ON DELETE cascade ON UPDATE no action;