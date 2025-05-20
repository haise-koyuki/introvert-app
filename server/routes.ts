import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertMessageSchema, 
  insertSettingsSchema,
  updateMessageSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware
  const handleError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Contact routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getContact(id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContactSchema.partial().parse(req.body);
      const updatedContact = await storage.updateContact(id, validatedData);
      if (!updatedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(updatedContact);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContact(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  });

  // Message routes
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/messages/pending", async (req, res) => {
    try {
      const pendingMessages = await storage.getPendingMessages();
      res.json(pendingMessages);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/contacts/:contactId/messages", async (req, res) => {
    try {
      const contactId = parseInt(req.params.contactId);
      const messages = await storage.getMessagesByContactId(contactId);
      res.json(messages);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.patch("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateMessageSchema.parse(req.body);
      const updatedMessage = await storage.updateMessage(id, validatedData);
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(updatedMessage);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      res.json(settings);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateSettings(validatedData);
      res.json(settings);
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
