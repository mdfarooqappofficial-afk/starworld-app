import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Live Rooms table for streaming/social spaces
 */
export const liveRooms = mysqlTable("live_rooms", {
  id: int("id").autoincrement().primaryKey(),
  hostId: int("hostId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  description: text("description"),
  isActive: int("isActive").default(1).notNull(),
  viewerCount: int("viewerCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LiveRoom = typeof liveRooms.$inferSelect;
export type InsertLiveRoom = typeof liveRooms.$inferInsert;

/**
 * Chat Messages table for real-time chat in rooms
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  messageType: mysqlEnum("messageType", ["text", "emoji", "reaction"]).default("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Couple Relationships table
 */
export const relationships = mysqlTable("relationships", {
  id: int("id").autoincrement().primaryKey(),
  userId1: int("userId1").notNull(),
  userId2: int("userId2").notNull(),
  status: mysqlEnum("status", ["proposed", "married", "divorced"]).default("proposed").notNull(),
  ringStyle: varchar("ringStyle", { length: 64 }),
  marriageDate: timestamp("marriageDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = typeof relationships.$inferInsert;

/**
 * User Achievements/Badges table
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeType: varchar("badgeType", { length: 64 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * AI Dream Events table for personalized notifications
 */
export const aiDreamEvents = mysqlTable("ai_dream_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  emoji: varchar("emoji", { length: 10 }),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIDreamEvent = typeof aiDreamEvents.$inferSelect;
export type InsertAIDreamEvent = typeof aiDreamEvents.$inferInsert;