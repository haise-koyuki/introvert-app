import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReminderTimeValue } from "@shared/schema";

type PrioritySettingsProps = {
  priority: '1' | '2' | '3';
  settings: {
    reminderTime: ReminderTimeValue;
    description: string;
  };
  onUpdate: (settings: { reminderTime?: ReminderTimeValue; description?: string }) => void;
}

export default function PrioritySettings({ priority, settings, onUpdate }: PrioritySettingsProps) {
  const priorityColors: Record<string, string> = {
    '1': 'bg-[hsl(var(--priority1))]',
    '2': 'bg-[hsl(var(--priority2))]',
    '3': 'bg-[hsl(var(--priority3))]',
  };
  
  const handleReminderTimeChange = (value: ReminderTimeValue) => {
    onUpdate({ reminderTime: value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ description: e.target.value });
  };
  
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
  
  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center mb-2">
        <span className={`w-4 h-4 ${priorityColors[priority]} rounded-full mr-2`}></span>
        <h4 className="font-medium">Priority {priority} ({settings.description})</h4>
      </div>
      <div className="ml-6">
        <div className="mb-2">
          <Label className="block text-sm text-gray-600 mb-1">Reminder Time</Label>
          <Select
            value={settings.reminderTime}
            onValueChange={(value) => handleReminderTimeChange(value as ReminderTimeValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select reminder time" />
            </SelectTrigger>
            <SelectContent>
              {reminderOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm text-gray-600 mb-1">Description</Label>
          <Input
            type="text"
            value={settings.description}
            onChange={handleDescriptionChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
