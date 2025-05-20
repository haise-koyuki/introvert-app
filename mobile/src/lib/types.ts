// Type definitions for the mobile app
// These should match the types defined in shared/schema.ts

export type PriorityLevel = "1" | "2" | "3";
export type MessageStatus = "pending" | "responded" | "snoozed";
export type ReminderTimeValue = "1h" | "2h" | "4h" | "6h" | "12h" | "1d" | "2d" | "3d" | "5d" | "7d";

export interface User {
  id: number;
  username: string;
}

export interface Contact {
  id: number;
  name: string;
  nickname: string | null;
  priority: PriorityLevel;
  reminderTime: ReminderTimeValue;
  apps: string[];
  createdAt: string;
}

export interface Message {
  id: number;
  contactId: number;
  content: string;
  platform: string;
  status: MessageStatus;
  receivedAt: string;
  respondedAt: string | null;
  snoozedUntil: string | null;
}

export interface Settings {
  id: number;
  priority1Time: ReminderTimeValue;
  priority1Description: string;
  priority2Time: ReminderTimeValue;
  priority2Description: string;
  priority3Time: ReminderTimeValue;
  priority3Description: string;
  enabledApps: string[];
  pushNotifications: boolean;
  soundAlerts: boolean;
  quickResponses: boolean;
  doNotDisturb: boolean;
}

// Types for creating new items
export interface InsertContact {
  name: string;
  nickname?: string | null;
  priority: PriorityLevel;
  reminderTime: ReminderTimeValue;
  apps: string[];
}

export interface InsertMessage {
  contactId: number;
  content: string;
  platform: string;
  status: MessageStatus;
  receivedAt: string;
}

export interface UpdateMessage {
  status: MessageStatus;
  snoozedUntil?: string;
  respondedAt?: string;
}

export interface InsertSettings {
  priority1Time: ReminderTimeValue;
  priority1Description: string;
  priority2Time: ReminderTimeValue;
  priority2Description: string;
  priority3Time: ReminderTimeValue;
  priority3Description: string;
  enabledApps: string[];
  pushNotifications: boolean;
  soundAlerts: boolean;
  quickResponses: boolean;
  doNotDisturb: boolean;
}