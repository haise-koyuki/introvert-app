import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contact, Message } from "@shared/schema";
import { useContacts } from "@/providers/ContactProvider";
import StatCard from "@/components/StatCard";
import ContactReminder from "@/components/ContactReminder";
import { calculateReminderProgress } from "@/lib/time-utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { contacts } = useContacts();
  
  const { data: pendingMessages = [], isLoading } = useQuery({
    queryKey: ['/api/messages/pending'],
  });
  
  // Process pending messages with contact information
  const processedMessages = pendingMessages.map((message: Message) => {
    const contact = contacts.find(c => c.id === message.contactId);
    if (!contact) return null;
    
    // Calculate progress percentage based on priority level and time elapsed
    const progress = calculateReminderProgress(message, contact);
    
    return {
      message,
      contact,
      progress
    };
  }).filter(Boolean);
  
  // Filter messages based on priority if a tab is selected
  const filteredMessages = activeTab === "all"
    ? processedMessages
    : processedMessages.filter(item => item?.contact.priority === activeTab.charAt(activeTab.length - 1));
  
  // Count messages by priority
  const priorityCounts = {
    "1": processedMessages.filter(item => item?.contact.priority === "1").length,
    "2": processedMessages.filter(item => item?.contact.priority === "2").length,
    "3": processedMessages.filter(item => item?.contact.priority === "3").length,
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-4">Pending Responses</h2>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            priority="1" 
            count={priorityCounts["1"]} 
            icon="priority_high" 
            title="Priority 1" 
          />
          <StatCard 
            priority="2" 
            count={priorityCounts["2"]} 
            icon="event_note" 
            title="Priority 2" 
          />
          <StatCard 
            priority="3" 
            count={priorityCounts["3"]} 
            icon="low_priority" 
            title="Priority 3" 
          />
        </div>
        
        {/* Contact List with Pending Responses */}
        <div className="bg-surface rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button 
                className={`px-4 py-3 font-medium ${activeTab === 'all' ? 'tab-active' : 'text-gray-500'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-3 font-medium ${activeTab === 'priority1' ? 'tab-active' : 'text-gray-500'}`}
                onClick={() => setActiveTab('priority1')}
              >
                Priority 1
              </button>
              <button 
                className={`px-4 py-3 font-medium ${activeTab === 'priority2' ? 'tab-active' : 'text-gray-500'}`}
                onClick={() => setActiveTab('priority2')}
              >
                Priority 2
              </button>
              <button 
                className={`px-4 py-3 font-medium ${activeTab === 'priority3' ? 'tab-active' : 'text-gray-500'}`}
                onClick={() => setActiveTab('priority3')}
              >
                Priority 3
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <span className="material-icons text-4xl mb-2">inbox</span>
                <p>No pending responses</p>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              filteredMessages.map(item => (
                <ContactReminder 
                  key={item.message.id}
                  message={item.message}
                  contact={item.contact}
                  progressPercentage={item.progress}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
