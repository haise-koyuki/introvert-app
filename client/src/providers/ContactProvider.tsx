import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@shared/schema";

type ContactContextType = {
  contacts: Contact[];
  isLoading: boolean;
  isError: boolean;
};

const ContactContext = createContext<ContactContextType>({
  contacts: [],
  isLoading: false,
  isError: false
});

export const useContacts = () => useContext(ContactContext);

export function ContactProvider({ children }: { children: ReactNode }) {
  const { data: contacts = [], isLoading, isError } = useQuery({
    queryKey: ['/api/contacts'],
  });

  return (
    <ContactContext.Provider value={{ contacts, isLoading, isError }}>
      {children}
    </ContactContext.Provider>
  );
}
