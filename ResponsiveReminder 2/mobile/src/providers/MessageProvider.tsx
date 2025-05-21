import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Message, UpdateMessage, InsertMessage } from '../lib/types';

// Define the context type
type MessageContextType = {
  pendingMessages: Message[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  markAsResponded: (messageId: number) => Promise<Message>;
  snoozeMessage: (messageId: number, hours: number) => Promise<Message>;
  createMessage: (message: InsertMessage) => Promise<Message>;
};

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Provider component
export function MessageProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // Query for fetching pending messages
  const { 
    data: pendingMessages = [], 
    isLoading,
    isError,
    error,
  } = useQuery<Message[], Error>({
    queryKey: ['messages', 'pending'],
    queryFn: () => api.getPendingMessages(),
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Mutation for updating a message (mark as responded)
  const updateMessageMutation = useMutation({
    mutationFn: ({ id, update }: { id: number; update: UpdateMessage }) => 
      api.updateMessage(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'pending'] });
    },
  });
  
  // Mutation for creating a message
  const createMessageMutation = useMutation({
    mutationFn: (message: InsertMessage) => api.createMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'pending'] });
    },
  });
  
  // Function to mark a message as responded
  const markAsResponded = async (messageId: number) => {
    return updateMessageMutation.mutateAsync({
      id: messageId,
      update: {
        status: 'responded',
        respondedAt: new Date().toISOString(),
      }
    });
  };
  
  // Function to snooze a message
  const snoozeMessage = async (messageId: number, hours: number) => {
    const snoozedUntil = new Date();
    snoozedUntil.setHours(snoozedUntil.getHours() + hours);
    
    return updateMessageMutation.mutateAsync({
      id: messageId,
      update: {
        status: 'snoozed',
        snoozedUntil: snoozedUntil.toISOString(),
      }
    });
  };
  
  // Function to create a new message
  const createMessage = async (message: InsertMessage) => {
    return createMessageMutation.mutateAsync(message);
  };
  
  // Provide the context value
  const contextValue: MessageContextType = {
    pendingMessages,
    isLoading,
    isError,
    error,
    markAsResponded,
    snoozeMessage,
    createMessage,
  };
  
  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
}

// Hook for using the message context
export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}