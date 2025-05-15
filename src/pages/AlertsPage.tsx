
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AlertBanner, AlertData } from "@/components/AlertBanner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  getGlobalAlerts, 
  createAlert, 
  setGlobalAlert, 
  removeGlobalAlert, 
  getAlertConfigurations,
  saveAlertConfiguration,
  deleteAlertConfiguration,
  toggleAlertMute,
  resetAlertCount
} from "@/utils/alertUtils";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, BellRing, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getFilteredProducts } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";

interface AlertConfiguration {
  id: string;
  name: string;
  type: "controllerStatus" | "aiStatus";
  condition: string;
  emails: string[];
  enabled: boolean;
  muted: boolean;
  triggerCount: number;
}

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [configurations, setConfigurations] = useState<AlertConfiguration[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newConfig, setNewConfig] = useState<Partial<AlertConfiguration>>({
    name: "",
    type: "controllerStatus",
    condition: "Warning",
    emails: [""],
    enabled: true,
    muted: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load existing alerts
    setAlerts(getGlobalAlerts());
    
    // Load alert configurations
    setConfigurations(getAlertConfigurations());
  }, []);

  const handleDismissAlert = (id: string) => {
    removeGlobalAlert(id);
    setAlerts(getGlobalAlerts());
    toast({
      title: "Alert dismissed",
      description: "The alert has been removed from the list."
    });
  };

  const handleAddConfiguration = () => {
    if (!newConfig.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for this alert configuration.",
        variant: "destructive"
      });
      return;
    }

    if (!newConfig.emails || newConfig.emails.length === 0 || !newConfig.emails[0]) {
      toast({
        title: "Missing information",
        description: "Please provide at least one email address for notifications.",
        variant: "destructive"
      });
      return;
    }

    // Create a new configuration
    const id = `config-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const completeConfig: AlertConfiguration = {
      id,
      name: newConfig.name || "Unnamed Alert",
      type: newConfig.type || "controllerStatus",
      condition: newConfig.condition || "Warning",
      emails: newConfig.emails || [""],
      enabled: newConfig.enabled ?? true,
      muted: newConfig.muted ?? false,
      triggerCount: 0
    };

    saveAlertConfiguration(completeConfig);
    setConfigurations([...configurations, completeConfig]);
    
    // Create a test alert
    const testAlert = createAlert(
      `${completeConfig.name} Created`, 
      `Alert configuration has been created to monitor ${completeConfig.type} for condition: ${completeConfig.condition}`,
      "info"
    );
    setGlobalAlert(testAlert);
    setAlerts([...alerts, testAlert]);
    
    // Close dialog and reset form
    setShowAddDialog(false);
    setNewConfig({
      name: "",
      type: "controllerStatus",
      condition: "Warning",
      emails: [""],
      enabled: true,
      muted: false
    });

    toast({
      title: "Alert configuration created",
      description: `${completeConfig.name} has been created and activated.`
    });
  };

  const handleToggleEnabled = (config: AlertConfiguration) => {
    const updated = {...config, enabled: !config.enabled};
    saveAlertConfiguration(updated);
    setConfigurations(configurations.map(c => c.id === config.id ? updated : c));
    toast({
      title: updated.enabled ? "Alert enabled" : "Alert disabled",
      description: `${updated.name} has been ${updated.enabled ? "enabled" : "disabled"}.`
    });
  };

  const handleToggleMute = (config: AlertConfiguration) => {
    const updated = {...config, muted: !config.muted};
    toggleAlertMute(updated.id, updated.muted);
    setConfigurations(configurations.map(c => c.id === config.id ? updated : c));
    toast({
      title: updated.muted ? "Alert muted" : "Alert unmuted",
      description: `${updated.name} notifications are now ${updated.muted ? "muted" : "active"}.`
    });
  };

  const handleResetCount = (config: AlertConfiguration) => {
    const updated = {...config, triggerCount: 0};
    resetAlertCount(updated.id);
    setConfigurations(configurations.map(c => c.id === config.id ? updated : c));
    toast({
      title: "Counter reset",
      description: `Alert counter for ${updated.name} has been reset to 0.`
    });
  };

  const handleDeleteConfiguration = (id: string) => {
    deleteAlertConfiguration(id);
    setConfigurations(configurations.filter(c => c.id !== id));
    toast({
      title: "Alert configuration deleted",
      description: "The alert configuration has been removed."
    });
  };

  const handleEmailChange = (index: number, value: string) => {
    const emails = [...(newConfig.emails || [""])];
    emails[index] = value;
    setNewConfig({...newConfig, emails});
  };

  const addEmailField = () => {
    setNewConfig({...newConfig, emails: [...(newConfig.emails || [""]), ""]});
  };

  const removeEmailField = (index: number) => {
    const emails = [...(newConfig.emails || [""])];
    emails.splice(index, 1);
    setNewConfig({...newConfig, emails});
  };

  const testAlert = (config: AlertConfiguration) => {
    // Create a test alert
    const testAlert = createAlert(
      `${config.name} Test`, 
      `This is a test alert for ${config.type} condition: ${config.condition}`,
      "info"
    );
    setGlobalAlert(testAlert);
    setAlerts([...alerts, testAlert]);
    
    toast({
      title: "Test alert sent",
      description: `A test alert has been triggered for ${config.name}.`
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-6 mx-auto space-y-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Alert Management</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Create New Alert
          </Button>
        </div>

        <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />

        <div>
          <h2 className="text-lg font-medium mb-3">Alert Configurations</h2>
          <div className="border rounded-md">
            {configurations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No alert configurations yet. Create one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Emails</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configurations.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">{config.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {config.type === "controllerStatus" ? "Controller Status" : "AI Status"}
                        </Badge>
                      </TableCell>
                      <TableCell>{config.condition}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {config.emails.join(", ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              config.enabled ? (config.muted ? "bg-yellow-400" : "bg-green-500") : "bg-red-500"
                            }`} 
                          />
                          <span>
                            {!config.enabled ? "Disabled" : (config.muted ? "Muted" : "Active")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={config.triggerCount > 0 ? "destructive" : "outline"}>
                          {config.triggerCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleEnabled(config)}
                          >
                            {config.enabled ? "Disable" : "Enable"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleMute(config)}
                          >
                            {config.muted ? "Unmute" : "Mute"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleResetCount(config)}
                          >
                            Reset Count
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => testAlert(config)}
                          >
                            Test
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteConfiguration(config.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Current Alerts */}
        <div>
          <h2 className="text-lg font-medium mb-3">Current Alerts</h2>
          <div className="border rounded-md">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No active alerts.
              </div>
            ) : (
              <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />
            )}
          </div>
        </div>
      </div>

      {/* Add Alert Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Alert Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="name">Name</Label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={newConfig.name} 
                onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="type">Type</Label>
              <select 
                id="type" 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newConfig.type}
                onChange={(e) => setNewConfig({...newConfig, type: e.target.value as "controllerStatus" | "aiStatus"})}
              >
                <option value="controllerStatus">Controller Status</option>
                <option value="aiStatus">AI Status</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="condition">Condition</Label>
              <select 
                id="condition" 
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newConfig.condition}
                onChange={(e) => setNewConfig({...newConfig, condition: e.target.value})}
              >
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
                <option value="NeedsRetraining">Needs Retraining</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Email Notifications</Label>
              {newConfig.emails?.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input 
                    type="email"
                    value={email}
                    placeholder="Email address" 
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  {index === 0 ? (
                    <Button type="button" size="icon" variant="outline" onClick={addEmailField}>
                      +
                    </Button>
                  ) : (
                    <Button type="button" size="icon" variant="outline" onClick={() => removeEmailField(index)}>
                      -
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="mute">Mute Notifications</Label>
              <Switch 
                id="mute" 
                checked={newConfig.muted} 
                onCheckedChange={(checked) => setNewConfig({...newConfig, muted: checked})}
              />
              <span className="text-sm text-muted-foreground">
                (Alerts are counted but emails not sent)
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddConfiguration}>
              <Bell className="mr-2 h-4 w-4" />
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AlertsPage;
