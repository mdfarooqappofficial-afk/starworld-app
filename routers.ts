import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // LIVE ROOMS & CHAT
  // ═══════════════════════════════════════════════════════════════

  rooms: router({
    list: publicProcedure.query(async () => {
      return db.getLiveRooms();
    }),

    getById: publicProcedure
      .input(z.object({ roomId: z.number() }))
      .query(async ({ input }) => {
        const room = await db.getRoomById(input.roomId);
        if (!room) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
        }
        return room;
      }),

    join: protectedProcedure
      .input(z.object({ roomId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const room = await db.getRoomById(input.roomId);
        if (!room) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
        }
        await db.incrementRoomViewers(input.roomId);
        return { success: true, viewerCount: (room.viewerCount || 0) + 1 };
      }),

    leave: protectedProcedure
      .input(z.object({ roomId: z.number() }))
      .mutation(async ({ input }) => {
        await db.decrementRoomViewers(input.roomId);
        return { success: true };
      }),
  }),

  chat: router({
    getMessages: publicProcedure
      .input(z.object({ roomId: z.number(), limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return db.getChatMessages(input.roomId, input.limit);
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          roomId: z.number(),
          message: z.string().min(1).max(500),
          messageType: z.enum(["text", "emoji", "reaction"]).default("text"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        await db.addChatMessage(
          input.roomId,
          ctx.user.id,
          input.message,
          input.messageType
        );
        return { success: true };
      }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // RELATIONSHIPS
  // ═══════════════════════════════════════════════════════════════

  relationships: router({
    getStatus: publicProcedure
      .input(z.object({ userId1: z.number(), userId2: z.number() }))
      .query(async ({ input }) => {
        return db.getUserRelationship(input.userId1, input.userId2);
      }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // AI DREAM EVENTS
  // ═══════════════════════════════════════════════════════════════

  aiDream: router({
    getEvents: protectedProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return db.getUserAIDreamEvents(ctx.user.id, input.limit);
      }),

    createEvent: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          eventType: z.string(),
          title: z.string(),
          description: z.string().optional(),
          emoji: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin" && ctx.user?.id !== input.userId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createAIDreamEvent(
          input.userId,
          input.eventType,
          input.title,
          input.description,
          input.emoji
        );
      }),
  })
});

export type AppRouter = typeof appRouter;
