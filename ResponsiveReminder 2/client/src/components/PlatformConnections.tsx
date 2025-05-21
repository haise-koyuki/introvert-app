import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type PlatformConnection = {
  id: string;
  name: string;
  isConnected: boolean;
  username?: string;
  lastSync?: string;
  icon: string;
};

export default function PlatformConnections() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<PlatformConnection | null>(null);
  const [connectionForm, setConnectionForm] = useState({
    username: "",
    password: ""
  });

  // Mock platforms - in a real app, these would come from an API
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    { id: "whatsapp", name: "WhatsApp", isConnected: false, icon: "chat" },
    { id: "messenger", name: "Messenger", isConnected: false, icon: "alternate_email" },
    { id: "instagram", name: "Instagram", isConnected: false, icon: "photo_camera" },
    { id: "discord", name: "Discord", isConnected: false, icon: "headset" },
    { id: "telegram", name: "Telegram", isConnected: false, icon: "send" },
    { id: "gmail", name: "Gmail", isConnected: false, icon: "mail" },
    { id: "twitter", name: "Twitter", isConnected: false, icon: "tag" },
    { id: "linkedin", name: "LinkedIn", isConnected: false, icon: "work" }
  ]);

  const handleConnectClick = (platform: PlatformConnection) => {
    setCurrentPlatform(platform);
    setConnectionForm({
      username: platform.username || "",
      password: ""
    });
    setIsConnecting(true);
  };

  const handleDisconnect = (platformId: string) => {
    // Here you would call an API to disconnect the platform
    setPlatforms(platforms.map(p => 
      p.id === platformId
        ? { ...p, isConnected: false, username: undefined, lastSync: undefined }
        : p
    ));
    
    toast({
      title: "Platform disconnected",
      description: "The platform has been disconnected successfully."
    });
  };

  const handleConnect = () => {
    if (!currentPlatform) return;
    
    if (!connectionForm.username) {
      toast({
        title: "Error",
        description: "Please enter your username or email.",
        variant: "destructive"
      });
      return;
    }
    
    if (!connectionForm.password) {
      toast({
        title: "Error",
        description: "Please enter your password.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would call an API to authenticate with the platform
    // For now, we'll simulate a successful connection
    const now = new Date().toISOString();
    setPlatforms(platforms.map(p => 
      p.id === currentPlatform.id
        ? { ...p, isConnected: true, username: connectionForm.username, lastSync: now }
        : p
    ));
    
    toast({
      title: "Platform connected",
      description: `${currentPlatform.name} has been connected successfully.`
    });
    
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Connected Platforms</h2>
        <span className="text-sm text-muted-foreground">
          {platforms.filter(p => p.isConnected).length} of {platforms.length} connected
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <span className="material-icons text-4xl text-primary">{platform.icon}</span>
              <div>
                <CardTitle>{platform.name}</CardTitle>
                {platform.isConnected && (
                  <CardDescription>
                    Connected as {platform.username}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {platform.isConnected ? (
                <div className="text-sm text-muted-foreground">
                  Last synced: {new Date(platform.lastSync!).toLocaleString()}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Connect your {platform.name} account to receive reminders for missed messages.
                </div>
              )}
            </CardContent>
            <CardFooter>
              {platform.isConnected ? (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDisconnect(platform.id)}
                  >
                    Disconnect
                  </Button>
                  <Button variant="outline">
                    Sync Now
                  </Button>
                </div>
              ) : (
                <Button onClick={() => handleConnectClick(platform)}>
                  <span className="material-icons mr-2">link</span>
                  Connect {platform.name}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {currentPlatform?.name}</DialogTitle>
            <DialogDescription>
              Enter your credentials to connect to {currentPlatform?.name}. 
              This will allow NotIntrovert to send you reminders for missed messages.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                placeholder={`Your ${currentPlatform?.name} username or email`}
                value={connectionForm.username}
                onChange={(e) => setConnectionForm({...connectionForm, username: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={connectionForm.password}
                onChange={(e) => setConnectionForm({...connectionForm, password: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Your credentials are securely stored and only used to connect to the platform.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnecting(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}