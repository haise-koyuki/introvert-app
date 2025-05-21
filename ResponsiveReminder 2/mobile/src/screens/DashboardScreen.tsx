import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Types will be imported from shared schema later
type Message = {
  id: number;
  contactId: number;
  content: string;
  platform: string;
  status: string;
  receivedAt: string;
}

type Contact = {
  id: number;
  name: string;
  nickname: string | null;
  priority: string;
  reminderTime: string;
}

type DashboardTabProps = {
  active: boolean;
  label: string;
  onPress: () => void;
}

const DashboardTab = ({ active, label, onPress }: DashboardTabProps) => (
  <TouchableOpacity 
    style={[styles.tab, active && styles.activeTab]} 
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const StatCard = ({ count, title, priority }: { count: number, title: string, priority: string }) => {
  // Different colors for different priorities
  const bgColors: Record<string, string> = {
    '1': '#fecaca',
    '2': '#fed7aa',
    '3': '#bbf7d0',
  };
  
  const textColors: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#10b981',
  };
  
  const iconNames: Record<string, string> = {
    '1': 'alert-circle',
    '2': 'calendar',
    '3': 'checkmark-circle',
  };

  return (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: bgColors[priority] }]}>
        <Ionicons name={iconNames[priority]} size={24} color={textColors[priority]} />
      </View>
      <View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statCount}>{count}</Text>
      </View>
    </View>
  );
};

const ContactReminderItem = ({ item }: { item: any }) => {
  const [responding, setResponding] = useState(false);
  const [snoozing, setSnoozing] = useState(false);
  
  // Different border colors for different priorities
  const borderColors: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#10b981',
  };
  
  const handleResponded = () => {
    setResponding(true);
    // In a real app, this would call an API to mark the message as responded
    setTimeout(() => {
      setResponding(false);
    }, 1000);
  };
  
  const handleSnooze = () => {
    setSnoozing(true);
    // In a real app, this would call an API to snooze the reminder
    setTimeout(() => {
      setSnoozing(false);
    }, 1000);
  };
  
  return (
    <View style={[styles.contactReminderItem, { borderLeftColor: borderColors[item.contact.priority] }]}>
      <View style={styles.contactReminderHeader}>
        <View style={styles.contactInfo}>
          <View style={styles.contactAvatar}>
            <Text style={styles.contactInitials}>
              {item.contact.name.split(' ').map((part: string) => part[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <View>
            <Text style={styles.contactName}>{item.contact.name}</Text>
            <View style={styles.platformInfo}>
              <Ionicons 
                name={
                  item.message.platform === "Messages" ? "chatbubble" : 
                  item.message.platform === "WhatsApp" ? "logo-whatsapp" :
                  item.message.platform === "Messenger" ? "logo-facebook" :
                  item.message.platform === "Instagram" ? "logo-instagram" :
                  item.message.platform === "Snapchat" ? "logo-snapchat" : "chatbubble"
                } 
                size={12} 
                color="#6b7280" 
              />
              <Text style={styles.platformText}>{item.message.platform}</Text>
              <Text style={styles.timeAgoText}>• 2h ago</Text>
            </View>
          </View>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={styles.respondedButton}
            onPress={handleResponded}
            disabled={responding}
          >
            {responding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.respondedButtonText}>Responded</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.snoozeButton}
            onPress={handleSnooze}
            disabled={snoozing}
          >
            {snoozing ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <Text style={styles.snoozeButtonText}>Later</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.messagePreview}>{item.message.content}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${item.progress}%`,
                backgroundColor: borderColors[item.contact.priority] 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressLabel, { color: borderColors[item.contact.priority] }]}>
          {item.progress > 80 ? "Almost due" : 
           item.progress > 50 ? "Respond soon" : 
           item.progress > 30 ? "Respond today" : "Low priority"}
        </Text>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for demonstration
  const mockMessages = [
    {
      message: {
        id: 1,
        contactId: 1,
        content: "Hey, can you get back to me about that project?",
        platform: "Messages",
        status: "pending",
        receivedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      contact: {
        id: 1,
        name: "John Smith",
        nickname: "Work Colleague",
        priority: "1",
        reminderTime: "2h",
      },
      progress: 90,
    },
    {
      message: {
        id: 2,
        contactId: 2,
        content: "When are you coming home for dinner?",
        platform: "WhatsApp",
        status: "pending",
        receivedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      contact: {
        id: 2,
        name: "Mom",
        nickname: "Mom",
        priority: "1",
        reminderTime: "1h",
      },
      progress: 70,
    },
    {
      message: {
        id: 3,
        contactId: 3,
        content: "Let's catch up sometime this week",
        platform: "Messenger",
        status: "pending",
        receivedAt: new Date(Date.now() - 7200000).toISOString(),
      },
      contact: {
        id: 3,
        name: "Alex Johnson",
        nickname: "Friend",
        priority: "2",
        reminderTime: "12h",
      },
      progress: 40,
    },
  ];
  
  // Simulating an API query loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter messages based on active tab
  const filteredMessages = activeTab === 'all' 
    ? mockMessages 
    : mockMessages.filter(item => item.contact.priority === activeTab.charAt(activeTab.length - 1));
  
  // Count messages by priority
  const priorityCounts = {
    "1": mockMessages.filter(item => item.contact.priority === "1").length,
    "2": mockMessages.filter(item => item.contact.priority === "2").length,
    "3": mockMessages.filter(item => item.contact.priority === "3").length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pending Responses</Text>
      
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard priority="1" count={priorityCounts["1"]} title="Priority 1" />
        <StatCard priority="2" count={priorityCounts["2"]} title="Priority 2" />
        <StatCard priority="3" count={priorityCounts["3"]} title="Priority 3" />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <DashboardTab 
          active={activeTab === 'all'} 
          label="All" 
          onPress={() => setActiveTab('all')}
        />
        <DashboardTab 
          active={activeTab === 'priority1'} 
          label="Priority 1" 
          onPress={() => setActiveTab('priority1')}
        />
        <DashboardTab 
          active={activeTab === 'priority2'} 
          label="Priority 2" 
          onPress={() => setActiveTab('priority2')}
        />
        <DashboardTab 
          active={activeTab === 'priority3'} 
          label="Priority 3" 
          onPress={() => setActiveTab('priority3')}
        />
      </View>
      
      {/* Contact Reminders List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : filteredMessages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="mail-open-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No pending responses</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.message.id.toString()}
          renderItem={({ item }) => <ContactReminderItem item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '32%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#7c3aed',
  },
  tabText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#7c3aed',
  },
  listContainer: {
    paddingBottom: 16,
  },
  contactReminderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderLeftWidth: 4,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactReminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  timeAgoText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  contactActions: {
    flexDirection: 'row',
  },
  respondedButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  respondedButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  snoozeButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  snoozeButtonText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  messagePreview: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    flex: 1,
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});