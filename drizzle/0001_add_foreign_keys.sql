CREATE TABLE `ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`from_user_id` text NOT NULL,
	`to_user_id` text NOT NULL,
	`score` integer NOT NULL,
	`comment` text DEFAULT '',
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_ratings_to_user` ON `ratings` (`to_user_id`);--> statement-breakpoint
CREATE INDEX `idx_ratings_session` ON `ratings` (`session_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`avatar` text DEFAULT '',
	`image_url` text DEFAULT '',
	`rating` real DEFAULT 0,
	`rating_count` integer DEFAULT 0,
	`created_at` integer DEFAULT 0 NOT NULL,
	`last_seen_at` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "avatar", "image_url", "rating", "rating_count", "created_at", "last_seen_at") SELECT "id", "name", "email", "avatar", "image_url", "rating", "rating_count", "created_at", "last_seen_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_time_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text DEFAULT '' NOT NULL,
	`user_avatar` text DEFAULT '',
	`user_image` text DEFAULT '',
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`date` text NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_time_slots`("id", "user_id", "user_name", "user_avatar", "user_image", "start_time", "end_time", "date", "status", "created_at") SELECT "id", "user_id", "user_name", "user_avatar", "user_image", "start_time", "end_time", "date", "status", "created_at" FROM `time_slots`;--> statement-breakpoint
DROP TABLE `time_slots`;--> statement-breakpoint
ALTER TABLE `__new_time_slots` RENAME TO `time_slots`;--> statement-breakpoint
CREATE INDEX `idx_slots_start_end` ON `time_slots` (`start_time`,`end_time`);--> statement-breakpoint
CREATE INDEX `idx_slots_status` ON `time_slots` (`status`);--> statement-breakpoint
CREATE INDEX `idx_slots_date` ON `time_slots` (`date`);--> statement-breakpoint
CREATE INDEX `idx_slots_user_id` ON `time_slots` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`time_slot_id` text NOT NULL,
	`host_id` text NOT NULL,
	`participant_id` text,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`room_name` text DEFAULT '',
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`host_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`participant_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "time_slot_id", "host_id", "participant_id", "start_time", "end_time", "status", "room_name", "created_at", "updated_at") SELECT "id", "time_slot_id", "host_id", "participant_id", "start_time", "end_time", "status", "room_name", "created_at", "updated_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE TABLE `__new_session_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`slot_id` text NOT NULL,
	`requester_id` text NOT NULL,
	`message` text DEFAULT '',
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`slot_id`) REFERENCES `time_slots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session_requests`("id", "slot_id", "requester_id", "message", "status", "created_at") SELECT "id", "slot_id", "requester_id", "message", "status", "created_at" FROM `session_requests`;--> statement-breakpoint
DROP TABLE `session_requests`;--> statement-breakpoint
ALTER TABLE `__new_session_requests` RENAME TO `session_requests`;--> statement-breakpoint
CREATE TABLE `__new_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`avatar_url` text DEFAULT '',
	`created_by` text NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_groups`("id", "name", "description", "avatar_url", "created_by", "created_at") SELECT "id", "name", "description", "avatar_url", "created_by", "created_at" FROM `groups`;--> statement-breakpoint
DROP TABLE `groups`;--> statement-breakpoint
ALTER TABLE `__new_groups` RENAME TO `groups`;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`sender_id` text NOT NULL,
	`receiver_id` text,
	`group_id` text,
	`content` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "sender_id", "receiver_id", "group_id", "content", "created_at") SELECT "id", "sender_id", "receiver_id", "group_id", "content", "created_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
CREATE INDEX `idx_messages_receiver` ON `messages` (`receiver_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_messages_group` ON `messages` (`group_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text DEFAULT 'info' NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '',
	`link` text DEFAULT '',
	`is_read` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "user_id", "type", "title", "body", "link", "is_read", "created_at") SELECT "id", "user_id", "type", "title", "body", "link", "is_read", "created_at" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;--> statement-breakpoint
CREATE INDEX `idx_notifications_user` ON `notifications` (`user_id`,`is_read`,`created_at`);--> statement-breakpoint
ALTER TABLE `group_members` ALTER COLUMN "group_id" TO "group_id" text NOT NULL REFERENCES groups(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group_members` ALTER COLUMN "user_id" TO "user_id" text NOT NULL REFERENCES users(id) ON DELETE no action ON UPDATE no action;