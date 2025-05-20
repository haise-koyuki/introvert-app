import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Types (these would come from the shared schema in a real app)
type Contact = {
  id: number;
  name: string;
  nickname: string | null;
  priority: string;
  reminderTime: string;
  apps: string[];
};

const ContactItem = ({ contact, onEdit }: { contact: Contact, onEdit: (contact: Contact) => void }) => {
  // Different colors for different priorities
  const priorityColors: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#10b981',
  };

  const formatReminderTime = (time: string) => {
    if (time === "1h") return "1 hour reminder";
    if (time === "2h") return "2 hour reminder";
    if (time === "4h") return "4 hour reminder";
    if (time === "6h") return "6 hour reminder";
    if (time === "12h") return "12 hour reminder";
    if (time === "1d") return "1 day reminder";
    if (time === "2d") return "2 day reminder";
    if (time === "3d") return "3 day reminder";
    if (time === "5d") return "5 day reminder";
    if (time === "7d") return "7 day reminder";
    return time;
  };

  return (
    <View style={[styles.contactItem, { borderLeftColor: priorityColors[contact.priority] }]}>
      <View style={styles.contactInfo}>
        <View style={styles.contactAvatar}>
          <Text style={styles.contactInitials}>
            {contact.name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2)}
          </Text>
        </View>
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <View style={styles.contactMeta}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColors[contact.priority] }]} />
            <Text style={styles.contactPriority}>Priority {contact.priority}</Text>
            <Text style={styles.metaSeparator}>•</Text>
            <Text style={styles.reminderTime}>{formatReminderTime(contact.reminderTime)}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => onEdit(contact)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
};

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for demonstration
  const mockContacts: Contact[] = [
    {
      id: 1,
      name: "John Smith",
      nickname: "Work Colleague",
      priority: "1",
      reminderTime: "2h",
      apps: ["Messages", "WhatsApp"]
    },
    {
      id: 2,
      name: "Mom",
      nickname: "Mom",
      priority: "1",
      reminderTime: "1h",
      apps: ["WhatsApp"]
    },
    {
      id: 3,
      name: "Alex Johnson",
      nickname: "Friend",
      priority: "2",
      reminderTime: "12h",
      apps: ["Messenger", "Instagram"]
    },
    {
      id: 4,
      name: "Sarah Williams",
      nickname: "Sister",
      priority: "1",
      reminderTime: "4h",
      apps: ["Messages", "Snapchat"]
    },
    {
      id: 5,
      name: "Michael Brown",
      nickname: "Classmate",
      priority: "3",
      reminderTime: "2d",
      apps: ["Messenger"]
    }
  ];

  // Filter contacts based on search query
  const filteredContacts = mockContacts.filter(
    contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.nickname && contact.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle editing a contact (in this demo, we only show delete option)
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalVisible(true);
  };

  // Handle deleting a contact
  const handleDeleteContact = () => {
    if (!selectedContact) return;
    
    setIsDeleting(true);
    // In a real app, this would call an API to delete the contact
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
      setSelectedContact(null);
      // Show success message
      Alert.alert("Contact Deleted", "The contact has been removed successfully.");
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No contacts found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or add a new contact</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ContactItem contact={item} onEdit={handleEditContact} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Contact?</Text>
            <Text style={styles.modalDescription}>
              This will remove {selectedContact?.name} from your contacts list.
              This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteContact}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#111827',
  },
  listContainer: {
    paddingBottom: 16,
  },
  contactItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  contactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  contactPriority: {
    fontSize: 12,
    color: '#6b7280',
  },
  metaSeparator: {
    fontSize: 12,
    color: '#6b7280',
    marginHorizontal: 4,
  },
  reminderTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    padding: 8,
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
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});