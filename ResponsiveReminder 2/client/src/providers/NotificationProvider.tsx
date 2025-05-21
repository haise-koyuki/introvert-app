import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useContacts } from "./ContactProvider";
import { useSettings } from "./SettingsProvider";
import { Message } from "@shared/schema";
import { calculateReminderProgress } from "@/lib/time-utils";

type NotificationContextType = {
  showNotification: (message: string, title?: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { contacts } = useContacts();
  const { settings } = useSettings();
  
  const { data: pendingMessages = [] } = useQuery({
    queryKey: ['/api/messages/pending'],
    refetchInterval: 60000, // Refetch every minute to check for new notifications
  });
  
  const showNotification = (message: string, title = "Notification") => {
    toast({
      title,
      description: message,
    });
    
    // In a real app, we'd also trigger browser notifications here
    if (settings?.pushNotifications && "Notification" in window) {
      // Check permission and request if needed
      if (Notification.permission === "granted") {
        new Notification(title, { body: message });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(title, { body: message });
          }
        });
      }
    }
    
    // Play sound if enabled
    if (settings?.soundAlerts) {
      // In a real app, we'd play a sound notification here
    }
  };

  // Check for notifications that should be shown
  useEffect(() => {
    // Don't show notifications if settings aren't loaded yet or DND is enabled
    if (!settings || settings.doNotDisturb) return;
    
    // Process messages to see if any need notifications
    pendingMessages.forEach((message: Message) => {
      const contact = contacts.find(c => c.id === message.contactId);
      if (!contact) return;
      
      const progress = calculateReminderProgress(message, contact);
      
      // Only show notifications for messages that are close to their deadline
      if (progress > 90) {
        showNotification(
          `Message from ${contact.name} is urgent and needs a response.`,
          "Response Required"
        );
      }
    });
  }, [pendingMessages, contacts, settings]);
  
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
