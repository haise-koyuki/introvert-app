import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/providers/SettingsProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { InsertContact, PriorityLevel, ReminderTimeValue } from "@shared/schema";

type AddContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddContactModal({ isOpen, onClose }: AddContactModalProps) {
  const { toast } = useToast();
  const { settings } = useSettings();
  
  const [formData, setFormData] = useState<Partial<InsertContact>>({
    name: "",
    nickname: "",
    priority: "1",
    reminderTime: settings?.priority1Time || "2h",
    apps: []
  });
  
  const createContactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest('POST', '/api/contacts', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Contact added",
        description: "The contact has been added successfully."
      });
      onClose();
      // Reset form
      setFormData({
        name: "",
        nickname: "",
        priority: "1",
        reminderTime: settings?.priority1Time || "2h",
        apps: []
      });
    }
  });
  
  const availableApps = [
    { name: "Messages", icon: "sms" },
    { name: "WhatsApp", icon: "chat" },
    { name: "Messenger", icon: "alternate_email" },
    { name: "Instagram", icon: "photo_camera" },
    { name: "Snapchat", icon: "filter_drama" }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePriorityChange = (value: PriorityLevel) => {
    let reminderTime: ReminderTimeValue = formData.reminderTime as ReminderTimeValue;
    
    // Set default reminder time based on priority
    if (value === "1" && settings) {
      reminderTime = settings.priority1Time as ReminderTimeValue;
    } else if (value === "2" && settings) {
      reminderTime = settings.priority2Time as ReminderTimeValue;
    } else if (value === "3" && settings) {
      reminderTime = settings.priority3Time as ReminderTimeValue;
    }
    
    setFormData({
      ...formData,
      priority: value,
      reminderTime
    });
  };
  
  const handleAppToggle = (app: string) => {
    const currentApps = formData.apps || [];
    if (currentApps.includes(app)) {
      setFormData({
        ...formData,
        apps: currentApps.filter(a => a !== app)
      });
    } else {
      setFormData({
        ...formData,
        apps: [...currentApps, app]
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a contact name.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.apps || formData.apps.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one app.",
        variant: "destructive"
      });
      return;
    }
    
    createContactMutation.mutate(formData as InsertContact);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter contact name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nickname">Nickname/Relationship (optional)</Label>
              <Input
                id="nickname"
                name="nickname"
                placeholder="E.g., Mom, Best Friend"
                value={formData.nickname || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={formData.priority?.toString()}
                onValueChange={(value) => handlePriorityChange(value as PriorityLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Priority 1 ({settings?.priority1Description || "Family & Best Friends"})</SelectItem>
                  <SelectItem value="2">Priority 2 ({settings?.priority2Description || "Friends & Relatives"})</SelectItem>
                  <SelectItem value="3">Priority 3 ({settings?.priority3Description || "Acquaintances"})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="reminderTime">Reminder Time</Label>
              <Select
                value={formData.reminderTime}
                onValueChange={(value) => setFormData({ ...formData, reminderTime: value as ReminderTimeValue })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="12h">12 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="2d">2 days</SelectItem>
                  <SelectItem value="3d">3 days</SelectItem>
                  <SelectItem value="5d">5 days</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Connected Apps</Label>
              <div className="space-y-2">
                {availableApps.map(app => (
                  <div key={app.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`app-${app.name}`}
                      checked={(formData.apps || []).includes(app.name)}
                      onCheckedChange={() => handleAppToggle(app.name)}
                    />
                    <Label htmlFor={`app-${app.name}`} className="flex items-center">
                      <span className="material-icons text-sm mr-2">{app.icon}</span>
                      {app.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContactMutation.isPending}>
              {createContactMutation.isPending ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
