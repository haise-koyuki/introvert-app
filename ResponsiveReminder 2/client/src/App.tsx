import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Contacts from "@/pages/contacts";
import Settings from "@/pages/settings";
import Connections from "@/pages/connections";
import AppBar from "@/components/AppBar";
import BottomNavigation from "@/components/BottomNavigation";
import AddContactModal from "@/components/AddContactModal";

function Router() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <AppBar />

      <main className="flex-1 overflow-auto pb-16">
        <Switch>
          <Route path="/">
            <Dashboard />
          </Route>
          <Route path="/contacts">
            <Contacts />
          </Route>
          <Route path="/connections">
            <Connections />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>

      <button 
        onClick={() => setIsAddContactModalOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-10"
      >
        <span className="material-icons">add</span>
      </button>

      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
      />

      <AddContactModal 
        isOpen={isAddContactModalOpen} 
        onClose={() => setIsAddContactModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
