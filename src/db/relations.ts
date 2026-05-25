import { relations } from "drizzle-orm/relations";
import {
  users,
  timeSlots,
  sessions,
  sessionRequests,
  groups,
  groupMembers,
  messages,
  notifications,
  ratings,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  timeSlots: many(timeSlots),
  hostedSessions: many(sessions, { relationName: "host" }),
  participatedSessions: many(sessions, { relationName: "participant" }),
  sessionRequests: many(sessionRequests),
  groupMembers: many(groupMembers),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  notifications: many(notifications),
  ratingsGiven: many(ratings, { relationName: "given" }),
  ratingsReceived: many(ratings, { relationName: "received" }),
}));

export const timeSlotsRelations = relations(timeSlots, ({ one, many }) => ({
  user: one(users, {
    fields: [timeSlots.userId],
    references: [users.id],
  }),
  sessions: many(sessions),
  sessionRequests: many(sessionRequests),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  timeSlot: one(timeSlots, {
    fields: [sessions.timeSlotId],
    references: [timeSlots.id],
  }),
  host: one(users, {
    fields: [sessions.hostId],
    references: [users.id],
    relationName: "host",
  }),
  participant: one(users, {
    fields: [sessions.participantId],
    references: [users.id],
    relationName: "participant",
  }),
}));

export const sessionRequestsRelations = relations(sessionRequests, ({ one }) => ({
  timeSlot: one(timeSlots, {
    fields: [sessionRequests.slotId],
    references: [timeSlots.id],
  }),
  requester: one(users, {
    fields: [sessionRequests.requesterId],
    references: [users.id],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  groupMembers: many(groupMembers),
  messages: many(messages),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  group: one(groups, {
    fields: [messages.groupId],
    references: [groups.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  session: one(sessions, {
    fields: [ratings.sessionId],
    references: [sessions.id],
  }),
  fromUser: one(users, {
    fields: [ratings.fromUserId],
    references: [users.id],
    relationName: "given",
  }),
  toUser: one(users, {
    fields: [ratings.toUserId],
    references: [users.id],
    relationName: "received",
  }),
}));

