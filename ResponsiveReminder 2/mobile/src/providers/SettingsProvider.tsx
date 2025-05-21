import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Settings, InsertSettings } from '../lib/types';

// Define the context type
type SettingsContextType = {
  settings: Settings | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  updateSettings: (settings: InsertSettings) => Promise<Settings>;
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // Query for fetching settings
  const { 
    data: settings = null, 
    isLoading,
    isError,
    error,
  } = useQuery<Settings | null, Error>({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        return await api.getSettings();
      } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
      }
    },
  });
  
  // Mutation for updating settings
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: InsertSettings) => api.updateSettings(newSettings),
    onSuccess: () => {
      // Invalidate the settings query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
  
  // Function to update settings
  const updateSettings = async (newSettings: InsertSettings) => {
    return updateSettingsMutation.mutateAsync(newSettings);
  };
  
  // Default settings to use when none are available
  const defaultSettings: Settings = {
    id: 0,
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
    doNotDisturb: false,
  };
  
  // Provide the context value
  const contextValue: SettingsContextType = {
    settings: settings || defaultSettings,
    isLoading,
    isError,
    error,
    updateSettings,
  };
  
  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook for using the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}