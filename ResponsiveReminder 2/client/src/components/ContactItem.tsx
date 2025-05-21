import { Contact } from "@shared/schema";

type ContactItemProps = {
  contact: Contact;
  onEdit: (contact: Contact) => void;
}

export default function ContactItem({ contact, onEdit }: ContactItemProps) {
  const getContactInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getPriorityColor = () => {
    if (contact.priority === "1") return "bg-[hsl(var(--priority1))]";
    if (contact.priority === "2") return "bg-[hsl(var(--priority2))]";
    return "bg-[hsl(var(--priority3))]";
  };
  
  const priorityClass = `priority-${contact.priority}`;
  const priorityColor = getPriorityColor();
  
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
    <div className={`p-4 flex items-center justify-between ${priorityClass}`}>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
          {getContactInitials(contact.name)}
        </div>
        <div className="ml-3">
          <h3 className="font-medium">{contact.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className={`w-2 h-2 rounded-full mr-1 ${priorityColor}`}></span>
            <span>Priority {contact.priority}</span>
            <span className="mx-1">•</span>
            <span>{formatReminderTime(contact.reminderTime)}</span>
          </div>
        </div>
      </div>
      <button 
        className="p-1 rounded-full hover:bg-gray-100"
        onClick={() => onEdit(contact)}
      >
        <span className="material-icons text-gray-400">more_vert</span>
      </button>
    </div>
  );
}
