import { 
  users, contacts, messages, settings,
  type User, type InsertUser, 
  type Contact, type InsertContact, 
  type Message, type InsertMessage, 
  type Settings, type InsertSettings, 
  type UpdateMessage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  getMessagesByContactId(contactId: number): Promise<Message[]>;
  getPendingMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, update: UpdateMessage): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  createOrUpdateSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactsMap: Map<number, Contact>;
  private messagesMap: Map<number, Message>;
  private settingsData: Settings | undefined;
  
  private userCurrentId: number;
  private contactCurrentId: number;
  private messageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactsMap = new Map();
    this.messagesMap = new Map();
    this.settingsData = undefined;
    
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.messageCurrentId = 1;
    
    // Initialize with default settings
    this.createOrUpdateSettings({
      priority1Time: "2h",
      priority1Description: "Family & Best Friends",
      priority2Time: "1d",
      priority2Description: "Friends & Relatives",
      priority3Time: "3d",
      priority3Description: "Acquaintances",
      enabledApps: ["Messages", "WhatsApp", "Messenger", "Instagram", "Snapchat"],
      pushNotifications: true,
      soundAlerts: true,
      quickResponses: true,
      doNotDisturb: false
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contactsMap.values());
  }
  
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contactsMap.get(id);
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contact: Contact = { 
      id,
      name: insertContact.name, 
      nickname: insertContact.nickname || null,
      priority: insertContact.priority,
      reminderTime: insertContact.reminderTime,
      apps: [...insertContact.apps],
      createdAt: now 
    };
    this.contactsMap.set(id, contact);
    return contact;
  }
  
  async updateContact(id: number, update: Partial<InsertContact>): Promise<Contact | undefined> {
    const existingContact = this.contactsMap.get(id);
    if (!existingContact) return undefined;
    
    const updatedContact: Contact = {
      id: existingContact.id,
      name: update.name || existingContact.name,
      nickname: update.nickname !== undefined ? update.nickname || null : existingContact.nickname,
      priority: update.priority || existingContact.priority,
      reminderTime: update.reminderTime || existingContact.reminderTime,
      apps: update.apps ? [...update.apps] : existingContact.apps,
      createdAt: existingContact.createdAt
    };
    
    this.contactsMap.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    return this.contactsMap.delete(id);
  }
  
  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messagesMap.values());
  }
  
  async getMessagesByContactId(contactId: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values())
      .filter(message => message.contactId === contactId);
  }
  
  async getPendingMessages(): Promise<Message[]> {
    const now = new Date();
    return Array.from(this.messagesMap.values())
      .filter(message => {
        if (message.status === "responded") return false;
        if (message.status === "snoozed" && message.snoozedUntil && message.snoozedUntil > now) return false;
        return true;
      });
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const message: Message = {
      ...insertMessage,
      id,
      respondedAt: null,
      snoozedUntil: null
    };
    this.messagesMap.set(id, message);
    return message;
  }
  
  async updateMessage(id: number, update: UpdateMessage): Promise<Message | undefined> {
    const existingMessage = this.messagesMap.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage: Message = {
      ...existingMessage,
      ...update
    };
    
    this.messagesMap.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteMessage(id: number): Promise<boolean> {
    return this.messagesMap.delete(id);
  }
  
  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    return this.settingsData;
  }
  
  async createOrUpdateSettings(insertSettings: InsertSettings): Promise<Settings> {
    const settings: Settings = {
      id: 1,
      priority1Time: insertSettings.priority1Time,
      priority1Description: insertSettings.priority1Description,
      priority2Time: insertSettings.priority2Time,
      priority2Description: insertSettings.priority2Description,
      priority3Time: insertSettings.priority3Time,
      priority3Description: insertSettings.priority3Description,
      enabledApps: [...insertSettings.enabledApps],
      pushNotifications: insertSettings.pushNotifications,
      soundAlerts: insertSettings.soundAlerts,
      quickResponses: insertSettings.quickResponses,
      doNotDisturb: insertSettings.doNotDisturb
    };
    this.settingsData = settings;
    return settings;
  }
}

export const storage = new MemStorage();
