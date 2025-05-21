import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlatformConnections from "@/components/PlatformConnections";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Connections() {
  const { toast } = useToast();

  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: "Notifications enabled",
            description: "You will now receive real-time notifications for messages."
          });
        } else {
          toast({
            title: "Notifications denied",
            description: "Please enable notifications in your browser settings to receive alerts.",
            variant: "destructive"
          });
        }
      });
    } else {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground">
          Connect and manage your messaging platforms
        </p>
      </div>

      <Tabs defaultValue="platforms">
        <TabsList>
          <TabsTrigger value="platforms">Messaging Platforms</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="platforms" className="mt-6">
          <PlatformConnections />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Notification Settings</h2>
              <p className="text-muted-foreground">
                Configure how you want to be notified about missed messages
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Browser Notifications</CardTitle>
                  <CardDescription>
                    Receive notifications in your browser when you miss messages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enable browser notifications to get real-time alerts when you need to respond to a message.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleEnableNotifications}>
                    <span className="material-icons mr-2">notifications</span>
                    Enable Notifications
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Get a daily digest of missed messages via email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of all your pending responses by email.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">
                    <span className="material-icons mr-2">email</span>
                    Configure Email
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Push Notifications</CardTitle>
                  <CardDescription>
                    Get push notifications on your mobile device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Install the NotIntrovert mobile app to receive push notifications.
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <span className="material-icons mr-2">android</span>
                      Android
                    </Button>
                    <Button variant="outline">
                      <span className="material-icons mr-2">phone_iphone</span>
                      iOS
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">API Access</h2>
              <p className="text-muted-foreground">
                Generate API keys to integrate with NotIntrovert
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>API Access Keys</CardTitle>
                <CardDescription>
                  Create and manage API keys to access NotIntrovert from other applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  API keys allow secure access to your NotIntrovert data from external applications or custom integrations.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 border rounded-md bg-muted">
                    <div>
                      <div className="font-medium">Personal API Key</div>
                      <div className="text-sm text-muted-foreground">Created on May 15, 2025</div>
                    </div>
                    <Button variant="outline" size="sm">
                      Reveal Key
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <span className="material-icons mr-2">vpn_key</span>
                  Generate New API Key
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configure webhooks to get real-time notifications on external services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Webhooks allow you to receive real-time updates on your own servers or integrate with services like Slack, Discord, or custom applications.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <span className="material-icons mr-2">webhook</span>
                  Configure Webhooks
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}