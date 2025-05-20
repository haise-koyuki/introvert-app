import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ContactProvider } from "./providers/ContactProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import { NotificationProvider } from "./providers/NotificationProvider";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ContactProvider>
      <SettingsProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </SettingsProvider>
    </ContactProvider>
  </QueryClientProvider>
);
