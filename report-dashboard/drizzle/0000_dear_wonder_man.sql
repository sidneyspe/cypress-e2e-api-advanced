CREATE TABLE `executions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`date_key` text NOT NULL,
	`created_at` text NOT NULL,
	`total_tests` integer DEFAULT 0 NOT NULL,
	`passed` integer DEFAULT 0 NOT NULL,
	`failed` integer DEFAULT 0 NOT NULL,
	`skipped` integer DEFAULT 0 NOT NULL,
	`pending` integer DEFAULT 0 NOT NULL,
	`pass_rate` real DEFAULT 0 NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`squad` text,
	`execution_type` text,
	`product` text,
	`module` text,
	`functionality` text
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`execution_id` integer NOT NULL,
	`test_id` text NOT NULL,
	`uuid` text,
	`title` text NOT NULL,
	`full_title` text,
	`suite_path` text,
	`file` text,
	`status` text NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`speed` text,
	`error_message` text,
	`error_stack` text,
	`code` text,
	`squad` text,
	`execution_type` text,
	`product` text,
	`module` text,
	`functionality` text,
	FOREIGN KEY (`execution_id`) REFERENCES `executions`(`id`) ON UPDATE no action ON DELETE cascade
);
