import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PriorityLevel, ReminderTimeValue, InsertContact } from '../lib/types';

type AddContactModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: InsertContact) => Promise<void>;
  defaultPrioritySettings?: {
    priority1Time: ReminderTimeValue;
    priority1Description: string;
    priority2Time: ReminderTimeValue;
    priority2Description: string;
    priority3Time: ReminderTimeValue;
    priority3Description: string;
  };
};

export default function AddContactModal({
  visible,
  onClose,
  onSave,
  defaultPrioritySettings,
}: AddContactModalProps) {
  const [formData, setFormData] = useState<Partial<InsertContact>>({
    name: '',
    nickname: '',
    priority: '1',
    reminderTime: defaultPrioritySettings?.priority1Time || '2h',
    apps: [],
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Available apps with their icons
  const availableApps = [
    { name: "Messages", icon: "chatbubble" },
    { name: "WhatsApp", icon: "logo-whatsapp" },
    { name: "Messenger", icon: "logo-facebook" },
    { name: "Instagram", icon: "logo-instagram" },
    { name: "Snapchat", icon: "logo-snapchat" },
    { name: "Discord", icon: "logo-discord" },
    { name: "Telegram", icon: "paper-plane" },
    { name: "Gmail", icon: "mail" },
    { name: "Twitter", icon: "logo-twitter" },
    { name: "LinkedIn", icon: "logo-linkedin" },
  ];
  
  // Time reminder options
  const reminderOptions: { value: ReminderTimeValue; label: string }[] = [
    { value: "1h", label: "1 hour" },
    { value: "2h", label: "2 hours" },
    { value: "4h", label: "4 hours" },
    { value: "6h", label: "6 hours" },
    { value: "12h", label: "12 hours" },
    { value: "1d", label: "1 day" },
    { value: "2d", label: "2 days" },
    { value: "3d", label: "3 days" },
    { value: "5d", label: "5 days" },
    { value: "7d", label: "7 days" },
  ];
  
  const handleInputChange = (field: keyof InsertContact, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handlePriorityChange = (value: PriorityLevel) => {
    let reminderTime: ReminderTimeValue | undefined = formData.reminderTime as ReminderTimeValue;
    
    // Set default reminder time based on priority
    if (value === "1" && defaultPrioritySettings) {
      reminderTime = defaultPrioritySettings.priority1Time;
    } else if (value === "2" && defaultPrioritySettings) {
      reminderTime = defaultPrioritySettings.priority2Time;
    } else if (value === "3" && defaultPrioritySettings) {
      reminderTime = defaultPrioritySettings.priority3Time;
    }
    
    setFormData({
      ...formData,
      priority: value,
      reminderTime,
    });
  };
  
  const handleAppToggle = (app: string) => {
    const currentApps = formData.apps || [];
    if (currentApps.includes(app)) {
      setFormData({
        ...formData,
        apps: currentApps.filter(a => a !== app),
      });
    } else {
      setFormData({
        ...formData,
        apps: [...currentApps, app],
      });
    }
  };
  
  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert("Error", "Please enter a contact name.");
      return;
    }
    
    if (!formData.apps || formData.apps.length === 0) {
      Alert.alert("Error", "Please select at least one app.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onSave(formData as InsertContact);
      setFormData({
        name: '',
        nickname: '',
        priority: '1',
        reminderTime: defaultPrioritySettings?.priority1Time || '2h',
        apps: [],
      });
      setSelectedTab(0);
      onClose();
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem saving the contact. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderBasicInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter contact name"
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nickname/Relationship (optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.nickname || ''}
          onChangeText={(text) => handleInputChange('nickname', text)}
          placeholder="E.g., Mom, Best Friend"
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.priorityButtons}>
          <TouchableOpacity
            style={[
              styles.priorityButton,
              formData.priority === '1' && styles.priorityButtonActive,
              { backgroundColor: formData.priority === '1' ? '#fecaca' : '#f3f4f6' }
            ]}
            onPress={() => handlePriorityChange('1')}
          >
            <Text
              style={[
                styles.priorityButtonText,
                formData.priority === '1' && { color: '#ef4444' }
              ]}
            >
              Priority 1
            </Text>
            <Text style={styles.priorityDescription}>
              {defaultPrioritySettings?.priority1Description || "Family & Best Friends"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.priorityButton,
              formData.priority === '2' && styles.priorityButtonActive,
              { backgroundColor: formData.priority === '2' ? '#fed7aa' : '#f3f4f6' }
            ]}
            onPress={() => handlePriorityChange('2')}
          >
            <Text
              style={[
                styles.priorityButtonText,
                formData.priority === '2' && { color: '#f97316' }
              ]}
            >
              Priority 2
            </Text>
            <Text style={styles.priorityDescription}>
              {defaultPrioritySettings?.priority2Description || "Friends & Relatives"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.priorityButton,
              formData.priority === '3' && styles.priorityButtonActive,
              { backgroundColor: formData.priority === '3' ? '#bbf7d0' : '#f3f4f6' }
            ]}
            onPress={() => handlePriorityChange('3')}
          >
            <Text
              style={[
                styles.priorityButtonText,
                formData.priority === '3' && { color: '#10b981' }
              ]}
            >
              Priority 3
            </Text>
            <Text style={styles.priorityDescription}>
              {defaultPrioritySettings?.priority3Description || "Acquaintances"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderReminderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reminder Time</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reminderOptionsContainer}
        >
          {reminderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.reminderOption,
                formData.reminderTime === option.value && styles.reminderOptionActive
              ]}
              onPress={() => handleInputChange('reminderTime', option.value)}
            >
              <Text
                style={[
                  styles.reminderOptionText,
                  formData.reminderTime === option.value && styles.reminderOptionTextActive
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Connected Apps</Text>
        <View style={styles.appsContainer}>
          {availableApps.map((app) => (
            <TouchableOpacity
              key={app.name}
              style={[
                styles.appToggle,
                (formData.apps || []).includes(app.name) && styles.appToggleActive
              ]}
              onPress={() => handleAppToggle(app.name)}
            >
              <Ionicons
                name={app.icon}
                size={24}
                color={(formData.apps || []).includes(app.name) ? '#22254E' : '#6b7280'}
                style={styles.appIcon}
              />
              <Text
                style={[
                  styles.appName,
                  (formData.apps || []).includes(app.name) && styles.appNameActive
                ]}
              >
                {app.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedTab(0)}
        >
          <Ionicons name="arrow-back" size={16} color="#6b7280" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Save Contact</Text>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Contact</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 0 && styles.activeTab]}
              onPress={() => setSelectedTab(0)}
            >
              <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>
                Basic Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 1 && styles.activeTab]}
              onPress={() => setSelectedTab(1)}
            >
              <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>
                Reminders
              </Text>
            </TouchableOpacity>
          </View>
          
          {selectedTab === 0 ? renderBasicInfo() : renderReminderSettings()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#22254E',
  },
  tabText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#22254E',
  },
  tabContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priorityButtons: {
    flexDirection: 'column',
    marginTop: 8,
  },
  priorityButton: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  priorityButtonActive: {
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  priorityButtonText: {
    fontWeight: '600',
    marginBottom: 2,
  },
  priorityDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  reminderOptionsContainer: {
    paddingVertical: 8,
  },
  reminderOption: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  reminderOptionActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  reminderOptionText: {
    color: '#6b7280',
  },
  reminderOptionTextActive: {
    color: '#7c3aed',
    fontWeight: '500',
  },
  appsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  appToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  appToggleActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  appIcon: {
    marginRight: 6,
  },
  appName: {
    color: '#6b7280',
  },
  appNameActive: {
    color: '#22254E',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  nextButton: {
    backgroundColor: '#22254E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 6,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 6,
  },
  saveButton: {
    backgroundColor: '#22254E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 6,
  },
});