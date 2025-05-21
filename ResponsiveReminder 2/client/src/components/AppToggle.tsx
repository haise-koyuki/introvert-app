import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type AppToggleProps = {
  app: string;
  icon: string;
  enabled: boolean;
  onToggle: (app: string, enabled: boolean) => void;
}

export default function AppToggle({ app, icon, enabled, onToggle }: AppToggleProps) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="material-icons mr-3 text-gray-700">{icon}</span>
        <span>{app}</span>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={(checked) => onToggle(app, checked)}
      />
    </div>
  );
}
