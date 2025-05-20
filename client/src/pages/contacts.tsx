import { useState } from "react";
import { useContacts } from "@/providers/ContactProvider";
import { Contact } from "@shared/schema";
import { Input } from "@/components/ui/input";
import ContactItem from "@/components/ContactItem";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AddContactModal from "@/components/AddContactModal";

export default function Contacts() {
  const { contacts, isLoading } = useContacts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Contact deleted",
        description: "The contact has been removed successfully."
      });
    }
  });
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.nickname && contact.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    // For now, we'll just show the delete dialog
    // In a full implementation, we'd have an edit modal
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteContact = async () => {
    if (selectedContact) {
      await deleteContactMutation.mutateAsync(selectedContact.id);
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-4">Contacts</h2>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons text-gray-400">search</span>
            </span>
            <Input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-lg"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Contact List */}
        <div className="bg-surface rounded-lg shadow divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <span className="material-icons text-4xl mb-2">person_off</span>
              <p>No contacts found</p>
              <p className="text-sm mt-1">Try adjusting your search or add a new contact</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <ContactItem 
                key={contact.id} 
                contact={contact} 
                onEdit={handleEditContact} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Delete Contact Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedContact?.name} from your contacts list.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContact}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteContactMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
