import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Settings, InsertSettings } from "@shared/schema";

type SettingsContextType = {
  settings: Settings | null;
  isLoading: boolean;
  isError: boolean;
  updateSettings: (settings: InsertSettings) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: false,
  isError: false,
  updateSettings: async () => {}
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data: settings = null, isLoading, isError } = useQuery({
    queryKey: ['/api/settings'],
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: InsertSettings) => {
      const response = await apiRequest('POST', '/api/settings', newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    }
  });

  const updateSettings = async (newSettings: InsertSettings) => {
    await mutation.mutateAsync(newSettings);
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        isLoading: isLoading || mutation.isPending, 
        isError, 
        updateSettings 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
