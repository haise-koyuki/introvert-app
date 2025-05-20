import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Contact, InsertContact } from '../lib/types';

// Define the context type
type ContactContextType = {
  contacts: Contact[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  addContact: (contact: InsertContact) => Promise<Contact>;
  updateContact: (id: number, contact: Partial<InsertContact>) => Promise<Contact>;
  deleteContact: (id: number) => Promise<void>;
};

// Create the context
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Provider component
export function ContactProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // Query for fetching contacts
  const { 
    data: contacts = [], 
    isLoading,
    isError,
    error,
  } = useQuery<Contact[], Error>({
    queryKey: ['contacts'],
    queryFn: () => api.getContacts(),
  });
  
  // Mutation for adding a contact
  const addContactMutation = useMutation({
    mutationFn: (contact: InsertContact) => api.createContact(contact),
    onSuccess: () => {
      // Invalidate the contacts query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  
  // Mutation for updating a contact
  const updateContactMutation = useMutation({
    mutationFn: ({ id, contact }: { id: number; contact: Partial<InsertContact> }) => 
      api.updateContact(id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  
  // Mutation for deleting a contact
  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => api.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  
  // Function to add a contact
  const addContact = async (contact: InsertContact) => {
    return addContactMutation.mutateAsync(contact);
  };
  
  // Function to update a contact
  const updateContact = async (id: number, contact: Partial<InsertContact>) => {
    return updateContactMutation.mutateAsync({ id, contact });
  };
  
  // Function to delete a contact
  const deleteContact = async (id: number) => {
    await deleteContactMutation.mutateAsync(id);
  };
  
  // Provide the context value
  const contextValue: ContactContextType = {
    contacts,
    isLoading,
    isError,
    error,
    addContact,
    updateContact,
    deleteContact,
  };
  
  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
}

// Hook for using the contact context
export function useContacts() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}