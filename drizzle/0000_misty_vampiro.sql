-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`name` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`avatar` text DEFAULT '',
	`image_url` text DEFAULT '',
	`created_at` integer DEFAULT 0 NOT NULL,
	`last_seen_at` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `time_slots` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`user_name` text DEFAULT '' NOT NULL,
	`user_avatar` text DEFAULT '',
	`user_image` text DEFAULT '',
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`date` text NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_slots_start_end` ON `time_slots` (`start_time`,`end_time`);--> statement-breakpoint
CREATE INDEX `idx_slots_status` ON `time_slots` (`status`);--> statement-breakpoint
CREATE INDEX `idx_slots_date` ON `time_slots` (`date`);--> statement-breakpoint
CREATE INDEX `idx_slots_user_id` ON `time_slots` (`user_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY,
	`time_slot_id` text NOT NULL,
	`host_id` text NOT NULL,
	`participant_id` text,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`room_name` text DEFAULT '',
	`created_at` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session_requests` (
	`id` text PRIMARY KEY,
	`slot_id` text NOT NULL,
	`requester_id` text NOT NULL,
	`message` text DEFAULT '',
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`avatar_url` text DEFAULT '',
	`created_by` text NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `group_members` (
	`group_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`joined_at` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`group_id`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY,
	`sender_id` text NOT NULL,
	`receiver_id` text,
	`group_id` text,
	`content` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_messages_receiver` ON `messages` (`receiver_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_messages_group` ON `messages` (`group_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`type` text DEFAULT 'info' NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '',
	`link` text DEFAULT '',
	`is_read` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_notifications_user` ON `notifications` (`user_id`,`is_read`,`created_at`);
*/