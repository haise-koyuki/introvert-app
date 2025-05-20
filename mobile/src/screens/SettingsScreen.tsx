import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Types for our settings
type ReminderTimeValue = '1h' | '2h' | '4h' | '6h' | '12h' | '1d' | '2d' | '3d' | '5d' | '7d';

type PrioritySettings = {
  reminderTime: ReminderTimeValue;
  description: string;
};

type Settings = {
  priority1Time: ReminderTimeValue;
  priority1Description: string;
  priority2Time: ReminderTimeValue;
  priority2Description: string;
  priority3Time: ReminderTimeValue;
  priority3Description: string;
  enabledApps: string[];
  pushNotifications: boolean;
  soundAlerts: boolean;
  quickResponses: boolean;
  doNotDisturb: boolean;
};

// PrioritySettingItem component
type PrioritySettingItemProps = {
  priority: '1' | '2' | '3';
  settings: PrioritySettings;
  onPress: () => void;
};

const PrioritySettingItem = ({ priority, settings, onPress }: PrioritySettingItemProps) => {
  // Different colors for different priorities
  const priorityColors: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#10b981',
  };

  const formatReminderTime = (time: string) => {
    if (time === "1h") return "1 hour";
    if (time === "2h") return "2 hours";
    if (time === "4h") return "4 hours";
    if (time === "6h") return "6 hours";
    if (time === "12h") return "12 hours";
    if (time === "1d") return "1 day";
    if (time === "2d") return "2 days";
    if (time === "3d") return "3 days";
    if (time === "5d") return "5 days";
    if (time === "7d") return "7 days";
    return time;
  };

  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingHeader}>
        <View style={styles.priorityIndicator}>
          <View 
            style={[
              styles.priorityDot, 
              { backgroundColor: priorityColors[priority] }
            ]} 
          />
          <Text style={styles.priorityTitle}>Priority {priority}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </View>
      <Text style={styles.settingDescription}>{settings.description}</Text>
      <Text style={styles.settingValue}>
        Reminder: {formatReminderTime(settings.reminderTime)}
      </Text>
    </TouchableOpacity>
  );
};

// AppToggle component
type AppToggleProps = {
  app: string;
  icon: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
};

const AppToggle = ({ app, icon, enabled, onToggle }: AppToggleProps) => {
  return (
    <View style={styles.appToggleItem}>
      <View style={styles.appInfo}>
        <Ionicons name={icon} size={20} color="#4b5563" style={styles.appIcon} />
        <Text style={styles.appName}>{app}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
        thumbColor={enabled ? '#7c3aed' : '#f4f3f4'}
      />
    </View>
  );
};

// NotificationSetting component
type NotificationSettingProps = {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
};

const NotificationSetting = ({ 
  title, 
  description, 
  enabled, 
  onToggle 
}: NotificationSettingProps) => {
  return (
    <View style={styles.notificationSettingItem}>
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationDescription}>{description}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: '#d1d5db', true: '#c4b5fd' }}
        thumbColor={enabled ? '#7c3aed' : '#f4f3f4'}
      />
    </View>
  );
};

export default function SettingsScreen() {
  // Mock settings data - in a real app, this would come from an API
  const [settings, setSettings] = useState<Settings>({
    priority1Time: '2h',
    priority1Description: 'Family & Best Friends',
    priority2Time: '1d',
    priority2Description: 'Friends & Relatives',
    priority3Time: '3d',
    priority3Description: 'Acquaintances',
    enabledApps: ['Messages', 'WhatsApp', 'Messenger', 'Instagram', 'Snapchat'],
    pushNotifications: true,
    soundAlerts: true,
    quickResponses: true,
    doNotDisturb: false,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Available apps with their icons
  const availableApps = [
    { name: "Messages", icon: "chatbubble" },
    { name: "WhatsApp", icon: "logo-whatsapp" },
    { name: "Messenger", icon: "logo-facebook" },
    { name: "Instagram", icon: "logo-instagram" },
    { name: "Snapchat", icon: "logo-snapchat" },
    { name: "Tinder", icon: "heart" },
    { name: "Bumble", icon: "people" }
  ];
  
  // Handle app toggle
  const handleAppToggle = (app: string, value: boolean) => {
    const updatedApps = value
      ? [...settings.enabledApps, app]
      : settings.enabledApps.filter(a => a !== app);
    
    // Simulate an API update
    setIsSaving(true);
    setTimeout(() => {
      setSettings({
        ...settings,
        enabledApps: updatedApps
      });
      setIsSaving(false);
      
      // Show success message
      Alert.alert(
        "App Setting Updated",
        `${app} is now ${value ? 'enabled' : 'disabled'}.`
      );
    }, 500);
  };
  
  // Handle notification setting toggle
  const handleNotificationToggle = (setting: keyof Settings, value: boolean) => {
    // Simulate an API update
    setIsSaving(true);
    setTimeout(() => {
      setSettings({
        ...settings,
        [setting]: value
      });
      setIsSaving(false);
      
      // Show success message
      Alert.alert(
        "Setting Updated",
        `Setting has been ${value ? 'enabled' : 'disabled'}.`
      );
    }, 500);
  };
  
  // Handle editing priority settings
  const handleEditPriority = (priority: '1' | '2' | '3') => {
    // In a real app, this would navigate to a detail screen
    // For demo purposes, we'll just show an alert
    Alert.alert(
      `Edit Priority ${priority}`,
      "This would navigate to a screen to edit priority settings."
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>
        
        {isSaving && (
          <View style={styles.savingOverlay}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.savingText}>Saving changes...</Text>
          </View>
        )}
        
        {/* Priority Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Settings</Text>
          
          <View style={styles.sectionContent}>
            <PrioritySettingItem
              priority="1"
              settings={{
                reminderTime: settings.priority1Time,
                description: settings.priority1Description
              }}
              onPress={() => handleEditPriority('1')}
            />
            
            <PrioritySettingItem
              priority="2"
              settings={{
                reminderTime: settings.priority2Time,
                description: settings.priority2Description
              }}
              onPress={() => handleEditPriority('2')}
            />
            
            <PrioritySettingItem
              priority="3"
              settings={{
                reminderTime: settings.priority3Time,
                description: settings.priority3Description
              }}
              onPress={() => handleEditPriority('3')}
            />
          </View>
        </View>
        
        {/* App Integration Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Integration</Text>
          <Text style={styles.sectionSubtitle}>
            Choose which apps to track for response reminders
          </Text>
          
          <View style={styles.sectionContent}>
            {availableApps.map((app) => (
              <AppToggle
                key={app.name}
                app={app.name}
                icon={app.icon}
                enabled={settings.enabledApps.includes(app.name)}
                onToggle={(value) => handleAppToggle(app.name, value)}
              />
            ))}
          </View>
        </View>
        
        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <View style={styles.sectionContent}>
            <NotificationSetting
              title="Push Notifications"
              description="Receive reminders as push notifications"
              enabled={settings.pushNotifications}
              onToggle={(value) => 
                handleNotificationToggle('pushNotifications', value)
              }
            />
            
            <NotificationSetting
              title="Sound Alerts"
              description="Play a sound when a reminder is triggered"
              enabled={settings.soundAlerts}
              onToggle={(value) => 
                handleNotificationToggle('soundAlerts', value)
              }
            />
            
            <NotificationSetting
              title="Quick Responses"
              description="Show response options in notifications"
              enabled={settings.quickResponses}
              onToggle={(value) => 
                handleNotificationToggle('quickResponses', value)
              }
            />
            
            <NotificationSetting
              title="Do Not Disturb"
              description="Pause all reminders during specified hours"
              enabled={settings.doNotDisturb}
              onToggle={(value) => 
                handleNotificationToggle('doNotDisturb', value)
              }
            />
          </View>
        </View>
        
        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.appVersion}>ReplyMinder v1.0.0</Text>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: '#4b5563',
  },
  appToggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    marginRight: 12,
  },
  appName: {
    fontSize: 16,
  },
  notificationSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: '#9ca3af',
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  savingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7c3aed',
  },
});