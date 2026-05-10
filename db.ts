import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chatMessages, liveRooms, relationships, achievements, aiDreamEvents } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ═══════════════════════════════════════════════════════════════
// CHAT & ROOMS QUERIES
// ═══════════════════════════════════════════════════════════════

export async function getLiveRooms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(liveRooms).where(eq(liveRooms.isActive, 1)).orderBy(desc(liveRooms.viewerCount));
}

export async function getRoomById(roomId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(liveRooms).where(eq(liveRooms.id, roomId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getChatMessages(roomId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.roomId, roomId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

export async function addChatMessage(roomId: number, userId: number, message: string, messageType: "text" | "emoji" | "reaction" = "text") {
  const db = await getDb();
  if (!db) return null;
  await db.insert(chatMessages).values({
    roomId,
    userId,
    message,
    messageType,
  });
  return { success: true };
}

export async function incrementRoomViewers(roomId: number) {
  const db = await getDb();
  if (!db) return;
  const room = await getRoomById(roomId);
  if (room) {
    await db
      .update(liveRooms)
      .set({ viewerCount: (room.viewerCount || 0) + 1 })
      .where(eq(liveRooms.id, roomId));
  }
}

export async function decrementRoomViewers(roomId: number) {
  const db = await getDb();
  if (!db) return;
  const room = await getRoomById(roomId);
  if (room && room.viewerCount > 0) {
    await db
      .update(liveRooms)
      .set({ viewerCount: room.viewerCount - 1 })
      .where(eq(liveRooms.id, roomId));
  }
}

// ═══════════════════════════════════════════════════════════════
// RELATIONSHIPS QUERIES
// ═══════════════════════════════════════════════════════════════

export async function getUserRelationship(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.userId1, userId1),
        eq(relationships.userId2, userId2)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// ═══════════════════════════════════════════════════════════════
// AI DREAM EVENTS QUERIES
// ═══════════════════════════════════════════════════════════════

export async function getUserAIDreamEvents(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(aiDreamEvents)
    .where(eq(aiDreamEvents.userId, userId))
    .orderBy(desc(aiDreamEvents.createdAt))
    .limit(limit);
}

export async function createAIDreamEvent(userId: number, eventType: string, title: string, description?: string, emoji?: string) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(aiDreamEvents).values({
    userId,
    eventType,
    title,
    description,
    emoji,
  });
}
