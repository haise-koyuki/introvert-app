import { useSettings } from "@/providers/SettingsProvider";
import PrioritySettings from "@/components/PrioritySettings";
import AppToggle from "@/components/AppToggle";
import NotificationSetting from "@/components/NotificationSetting";
import { ReminderTimeValue } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const { toast } = useToast();
  
  const handlePriority1Update = (update: { reminderTime?: ReminderTimeValue; description?: string }) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      priority1Time: update.reminderTime || settings.priority1Time,
      priority1Description: update.description || settings.priority1Description
    });
    
    toast({
      title: "Settings updated",
      description: "Priority 1 settings have been updated."
    });
  };
  
  const handlePriority2Update = (update: { reminderTime?: ReminderTimeValue; description?: string }) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      priority2Time: update.reminderTime || settings.priority2Time,
      priority2Description: update.description || settings.priority2Description
    });
    
    toast({
      title: "Settings updated",
      description: "Priority 2 settings have been updated."
    });
  };
  
  const handlePriority3Update = (update: { reminderTime?: ReminderTimeValue; description?: string }) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      priority3Time: update.reminderTime || settings.priority3Time,
      priority3Description: update.description || settings.priority3Description
    });
    
    toast({
      title: "Settings updated",
      description: "Priority 3 settings have been updated."
    });
  };
  
  const handleAppToggle = (app: string, enabled: boolean) => {
    if (!settings) return;
    
    const updatedApps = enabled
      ? [...settings.enabledApps, app]
      : settings.enabledApps.filter(a => a !== app);
    
    updateSettings({
      ...settings,
      enabledApps: updatedApps
    });
    
    toast({
      title: "App integration updated",
      description: `${app} is now ${enabled ? 'enabled' : 'disabled'}.`
    });
  };
  
  const handleNotificationSettingToggle = (setting: string, enabled: boolean) => {
    if (!settings) return;
    
    updateSettings({
      ...settings,
      [setting]: enabled
    });
    
    toast({
      title: "Notification setting updated",
      description: `Setting has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  };
  
  if (isLoading || !settings) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-medium mb-4">Settings</h2>
          <div className="text-center p-8">Loading settings...</div>
        </div>
      </div>
    );
  }
  
  const availableApps = [
    { name: "Messages", icon: "sms" },
    { name: "WhatsApp", icon: "chat" },
    { name: "Messenger", icon: "alternate_email" },
    { name: "Instagram", icon: "photo_camera" },
    { name: "Snapchat", icon: "filter_drama" },
    { name: "Tinder", icon: "favorite" },
    { name: "Bumble", icon: "groups" }
  ];
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-4">Settings</h2>
        
        {/* Priority Settings */}
        <div className="bg-surface rounded-lg shadow mb-4">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium">Priority Settings</h3>
          </div>
          
          <PrioritySettings
            priority="1"
            settings={{
              reminderTime: settings.priority1Time as ReminderTimeValue,
              description: settings.priority1Description
            }}
            onUpdate={handlePriority1Update}
          />
          
          <PrioritySettings
            priority="2"
            settings={{
              reminderTime: settings.priority2Time as ReminderTimeValue,
              description: settings.priority2Description
            }}
            onUpdate={handlePriority2Update}
          />
          
          <PrioritySettings
            priority="3"
            settings={{
              reminderTime: settings.priority3Time as ReminderTimeValue,
              description: settings.priority3Description
            }}
            onUpdate={handlePriority3Update}
          />
        </div>
        
        {/* App Integration Settings */}
        <div className="bg-surface rounded-lg shadow mb-4">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium">App Integration</h3>
            <p className="text-sm text-gray-500">Choose which apps to track for response reminders</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {availableApps.map((app) => (
              <AppToggle
                key={app.name}
                app={app.name}
                icon={app.icon}
                enabled={settings.enabledApps.includes(app.name)}
                onToggle={handleAppToggle}
              />
            ))}
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-surface rounded-lg shadow">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-medium">Notification Settings</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <NotificationSetting
              title="Push Notifications"
              description="Receive reminders as push notifications"
              enabled={settings.pushNotifications}
              onToggle={(enabled) => handleNotificationSettingToggle('pushNotifications', enabled)}
            />
            
            <NotificationSetting
              title="Sound Alerts"
              description="Play a sound when a reminder is triggered"
              enabled={settings.soundAlerts}
              onToggle={(enabled) => handleNotificationSettingToggle('soundAlerts', enabled)}
            />
            
            <NotificationSetting
              title="Quick Responses"
              description="Show response options in notifications"
              enabled={settings.quickResponses}
              onToggle={(enabled) => handleNotificationSettingToggle('quickResponses', enabled)}
            />
            
            <NotificationSetting
              title="Do Not Disturb"
              description="Pause all reminders during specified hours"
              enabled={settings.doNotDisturb}
              onToggle={(enabled) => handleNotificationSettingToggle('doNotDisturb', enabled)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
