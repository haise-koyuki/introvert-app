import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Message, Contact } from '../lib/types';
import { formatTimeAgo, calculateReminderProgress } from '../lib/time-utils';

type ContactReminderItemProps = {
  message: Message;
  contact: Contact;
  onResponded: (messageId: number) => Promise<void>;
  onSnoozed: (messageId: number) => Promise<void>;
};

export default function ContactReminderItem({
  message,
  contact,
  onResponded,
  onSnoozed,
}: ContactReminderItemProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [isSnoozing, setIsSnoozing] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = calculateReminderProgress(message, contact);
  
  // Different colors for different priorities
  const priorityColors: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#10b981',
  };
  
  const handleResponded = async () => {
    try {
      setIsResponding(true);
      await onResponded(message.id);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem marking this message as responded. Please try again."
      );
    } finally {
      setIsResponding(false);
    }
  };
  
  const handleSnooze = async () => {
    try {
      setIsSnoozing(true);
      await onSnoozed(message.id);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem snoozing this reminder. Please try again."
      );
    } finally {
      setIsSnoozing(false);
    }
  };
  
  // Get platform icon
  const getPlatformIcon = () => {
    switch (message.platform) {
      case "Messages": return "chatbubble";
      case "WhatsApp": return "logo-whatsapp";
      case "Messenger": return "logo-facebook";
      case "Instagram": return "logo-instagram";
      case "Snapchat": return "logo-snapchat";
      default: return "chatbubble";
    }
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Format message preview
  const formatMessagePreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };
  
  // Get progress label
  const getProgressLabel = () => {
    if (progressPercentage > 80) return "Almost due";
    if (progressPercentage > 50) return "Respond soon";
    if (progressPercentage > 30) return "Respond today";
    return "Low priority";
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { borderLeftColor: priorityColors[contact.priority] }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.contactInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(contact.name)}
            </Text>
          </View>
          <View>
            <Text style={styles.name}>{contact.name}</Text>
            <View style={styles.metaInfo}>
              <Ionicons name={getPlatformIcon()} size={12} color="#6b7280" />
              <Text style={styles.platform}>{message.platform}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.timeAgo}>{formatTimeAgo(message.receivedAt)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.respondButton}
            onPress={handleResponded}
            disabled={isResponding}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.respondButtonText}>Responded</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.snoozeButton}
            onPress={handleSnooze}
            disabled={isSnoozing}
          >
            {isSnoozing ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <Text style={styles.snoozeButtonText}>Later</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.messageContent}>
        {formatMessagePreview(message.content)}
      </Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: priorityColors[contact.priority] 
              }
            ]} 
          />
        </View>
        <Text 
          style={[
            styles.progressLabel, 
            { color: priorityColors[contact.priority] }
          ]}
        >
          {getProgressLabel()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platform: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  dot: {
    fontSize: 12,
    color: '#6b7280',
    marginHorizontal: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
  },
  respondButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  respondButtonText: {
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
  messageContent: {
    fontSize: 14,
    color: '#4b5563',
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
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});