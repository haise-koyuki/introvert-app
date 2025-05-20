import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Message, Contact } from "@shared/schema";

type ContactReminderProps = {
  message: Message;
  contact: Contact;
  progressPercentage: number;
}

export default function ContactReminder({ message, contact, progressPercentage }: ContactReminderProps) {
  const { toast } = useToast();
  
  const respondedMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/messages/${message.id}`, {
        status: 'responded',
        respondedAt: new Date()
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/pending'] });
      toast({
        title: "Message marked as responded",
        description: `You've marked message from ${contact.name} as responded.`
      });
    }
  });
  
  const remindLaterMutation = useMutation({
    mutationFn: async () => {
      // Snooze for a few hours
      const snoozedUntil = new Date();
      snoozedUntil.setHours(snoozedUntil.getHours() + 3);
      
      const response = await apiRequest('PATCH', `/api/messages/${message.id}`, {
        status: 'snoozed',
        snoozedUntil
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages/pending'] });
      toast({
        title: "Reminder snoozed",
        description: `You'll be reminded about ${contact.name}'s message later.`
      });
    }
  });
  
  const getContactInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const formatMessagePreview = (content: string, maxLength = 40) => {
    if (content.length <= maxLength) return content;
    return `"${content.substring(0, maxLength)}..."`;
  };
  
  const getProgressLabel = () => {
    if (progressPercentage > 80) return "Almost due";
    if (progressPercentage > 50) return "Respond soon";
    if (progressPercentage > 30) return "Respond today";
    return "Low priority";
  };
  
  const getPriorityColorClass = () => {
    if (contact.priority === "1") return "text-[hsl(var(--priority1))] bg-[hsl(var(--priority1))]";
    if (contact.priority === "2") return "text-[hsl(var(--priority2))] bg-[hsl(var(--priority2))]";
    return "text-[hsl(var(--priority3))] bg-[hsl(var(--priority3))]";
  };
  
  const priorityClass = `priority-${contact.priority}`;
  const priorityColors = getPriorityColorClass();
  const textColor = priorityColors.split(' ')[0];
  
  return (
    <div className={`p-4 ${priorityClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
            {getContactInitials(contact.name)}
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{contact.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="material-icons text-xs mr-1">
                {message.platform === "Messages" ? "sms" : 
                 message.platform === "WhatsApp" ? "chat" :
                 message.platform === "Messenger" ? "alternate_email" :
                 message.platform === "Instagram" ? "photo_camera" :
                 message.platform === "Snapchat" ? "filter_drama" : "chat"}
              </span>
              <span>{message.platform}</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(new Date(message.receivedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => respondedMutation.mutate()}
            disabled={respondedMutation.isPending}
            className="bg-primary text-white px-3 py-1 rounded-full text-sm mr-2"
          >
            {respondedMutation.isPending ? "..." : "Responded"}
          </button>
          <button 
            onClick={() => remindLaterMutation.mutate()}
            disabled={remindLaterMutation.isPending}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {remindLaterMutation.isPending ? "..." : "Later"}
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {formatMessagePreview(message.content)}
      </div>
      <div className="mt-2 flex items-center">
        <div className="h-1 flex-grow rounded-full bg-gray-100">
          <div 
            className={`h-1 rounded-full ${priorityColors.split(' ')[1]}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className={`ml-2 text-xs font-medium ${textColor}`}>
          {getProgressLabel()}
        </span>
      </div>
    </div>
  );
}
