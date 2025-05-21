import { Switch } from "@/components/ui/switch";

type NotificationSettingProps = {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function NotificationSetting({ title, description, enabled, onToggle }: NotificationSettingProps) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
}
