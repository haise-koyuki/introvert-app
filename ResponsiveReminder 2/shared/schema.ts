import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const priorityLevels = z.enum(["1", "2", "3"]);
export type PriorityLevel = z.infer<typeof priorityLevels>;

export const messageStatuses = z.enum(["pending", "responded", "snoozed"]);
export type MessageStatus = z.infer<typeof messageStatuses>;

export const reminderTimeValues = z.enum([
  "1h", "2h", "4h", "6h", "12h", "1d", "2d", "3d", "5d", "7d"
]);
export type ReminderTimeValue = z.infer<typeof reminderTimeValues>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nickname: text("nickname"),
  priority: text("priority").notNull(),
  reminderTime: text("reminder_time").notNull(),
  apps: json("apps").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull(),
  receivedAt: timestamp("received_at").notNull(),
  respondedAt: timestamp("responded_at"),
  snoozedUntil: timestamp("snoozed_until"),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  priority1Time: text("priority1_time").notNull(),
  priority1Description: text("priority1_description").notNull(),
  priority2Time: text("priority2_time").notNull(),
  priority2Description: text("priority2_description").notNull(),
  priority3Time: text("priority3_time").notNull(),
  priority3Description: text("priority3_description").notNull(),
  enabledApps: json("enabled_apps").notNull().$type<string[]>(),
  pushNotifications: boolean("push_notifications").notNull(),
  soundAlerts: boolean("sound_alerts").notNull(),
  quickResponses: boolean("quick_responses").notNull(),
  doNotDisturb: boolean("do_not_disturb").notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, respondedAt: true, snoozedUntil: true });
export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export const updateMessageSchema = z.object({
  status: messageStatuses,
  snoozedUntil: z.date().optional(),
  respondedAt: z.date().optional(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type UpdateMessage = z.infer<typeof updateMessageSchema>;
