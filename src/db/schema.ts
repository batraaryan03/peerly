import { sqliteTable, AnySQLiteColumn, text, integer, index, primaryKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: text().primaryKey(),
	name: text().default("").notNull(),
	email: text().default("").notNull(),
	avatar: text().default(""),
	imageUrl: text("image_url").default(""),
	createdAt: integer("created_at").default(0).notNull(),
	lastSeenAt: integer("last_seen_at").default(0),
});

export const timeSlots = sqliteTable("time_slots", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	userName: text("user_name").default("").notNull(),
	userAvatar: text("user_avatar").default(""),
	userImage: text("user_image").default(""),
	startTime: text("start_time").notNull(),
	endTime: text("end_time").notNull(),
	date: text().notNull(),
	status: text().default("available").notNull(),
	createdAt: integer("created_at").default(0).notNull(),
},
(table) => [
	index("idx_slots_start_end").on(table.startTime, table.endTime),
	index("idx_slots_status").on(table.status),
	index("idx_slots_date").on(table.date),
	index("idx_slots_user_id").on(table.userId),
]);

export const sessions = sqliteTable("sessions", {
	id: text().primaryKey(),
	timeSlotId: text("time_slot_id").notNull(),
	hostId: text("host_id").notNull(),
	participantId: text("participant_id"),
	startTime: text("start_time").notNull(),
	endTime: text("end_time").notNull(),
	status: text().default("pending").notNull(),
	roomName: text("room_name").default(""),
	createdAt: integer("created_at").default(0).notNull(),
	updatedAt: integer("updated_at").default(0).notNull(),
});

export const sessionRequests = sqliteTable("session_requests", {
	id: text().primaryKey(),
	slotId: text("slot_id").notNull(),
	requesterId: text("requester_id").notNull(),
	message: text().default(""),
	status: text().default("pending").notNull(),
	createdAt: integer("created_at").default(0).notNull(),
});

export const groups = sqliteTable("groups", {
	id: text().primaryKey(),
	name: text().notNull(),
	description: text().default(""),
	avatarUrl: text("avatar_url").default(""),
	createdBy: text("created_by").notNull(),
	createdAt: integer("created_at").default(0).notNull(),
});

export const groupMembers = sqliteTable("group_members", {
	groupId: text("group_id").notNull(),
	userId: text("user_id").notNull(),
	role: text().default("member").notNull(),
	joinedAt: integer("joined_at").default(0).notNull(),
},
(table) => [
	primaryKey({ columns: [table.groupId, table.userId], name: "group_members_group_id_user_id_pk"})
]);

export const messages = sqliteTable("messages", {
	id: text().primaryKey(),
	senderId: text("sender_id").notNull(),
	receiverId: text("receiver_id"),
	groupId: text("group_id"),
	content: text().default("").notNull(),
	createdAt: integer("created_at").default(0).notNull(),
},
(table) => [
	index("idx_messages_receiver").on(table.receiverId, table.createdAt),
	index("idx_messages_group").on(table.groupId, table.createdAt),
]);

export const notifications = sqliteTable("notifications", {
	id: text().primaryKey(),
	userId: text("user_id").notNull(),
	type: text().default("info").notNull(),
	title: text().default("").notNull(),
	body: text().default(""),
	link: text().default(""),
	isRead: integer("is_read").default(0).notNull(),
	createdAt: integer("created_at").default(0).notNull(),
},
(table) => [
	index("idx_notifications_user").on(table.userId, table.isRead, table.createdAt),
]);

