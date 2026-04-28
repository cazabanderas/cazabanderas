CREATE TABLE `invitationUses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invitationId` int NOT NULL,
	`usedByOpenId` varchar(64),
	`usedByEmail` varchar(320),
	`wasConverted` int NOT NULL DEFAULT 0,
	`convertedToUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invitationUses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamInvitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdBy` int NOT NULL,
	`maxUses` int NOT NULL DEFAULT 0,
	`usedCount` int NOT NULL DEFAULT 0,
	`expiresAt` timestamp,
	`isActive` int NOT NULL DEFAULT 1,
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamInvitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `teamInvitations_token_unique` UNIQUE(`token`)
);
