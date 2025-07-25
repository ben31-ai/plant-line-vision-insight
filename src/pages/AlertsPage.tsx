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
import { Mail, Bell, BellRing, AlertTriangle, Equal, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, MoreHorizontal, X, Code, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getFilteredProducts } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AlertConfiguration {
  id: string;
  name: string;
  type: "controllerStatus" | "aiStatus" | "temperature" | "pressure" | "serialNumber" | "partNumber";
  condition: string;
  operator: string;
  value: string;
  secondValue?: string; // for "between" operator
  emails: string[];
  enabled: boolean;
  muted: boolean;
  triggerCount: number;
}

// Define field types and their available operators
const fieldTypes = {
  controllerStatus: { type: "string", operators: ["equal", "notEqual", "contains", "notContains", "regex"] },
  aiStatus: { type: "string", operators: ["equal", "notEqual", "contains", "notContains", "regex"] },
  temperature: { type: "number", operators: ["equal", "notEqual", "greater", "less", "lessOrEqual", "greaterOrEqual", "between", "notBetween"] },
  pressure: { type: "number", operators: ["equal", "notEqual", "greater", "less", "lessOrEqual", "greaterOrEqual", "between", "notBetween"] },
  serialNumber: { type: "string", operators: ["equal", "notEqual", "contains", "notContains", "regex"] },
  partNumber: { type: "string", operators: ["equal", "notEqual", "contains", "notContains", "regex"] }
};

const operatorLabels = {
  equal: "Equal to",
  notEqual: "Not equal to",
  greater: "Greater than",
  less: "Less than",
  lessOrEqual: "Less than or equal to",
  greaterOrEqual: "Greater than or equal to",
  between: "Between",
  notBetween: "Not between",
  contains: "Contains",
  notContains: "Does not contain",
  regex: "Matches regex"
};

const statusOptions = ["Warning", "Error", "OK", "NeedsRetraining"];

// Helper function to get operator icon and styling
const getOperatorBadge = (operator: string) => {
  const operatorConfig = {
    equal: { icon: Equal, variant: "outline" as const, color: "text-blue-600" },
    notEqual: { icon: X, variant: "outline" as const, color: "text-red-600" },
    greater: { icon: ChevronUp, variant: "outline" as const, color: "text-green-600" },
    less: { icon: ChevronDown, variant: "outline" as const, color: "text-red-600" },
    lessOrEqual: { icon: ChevronLeft, variant: "outline" as const, color: "text-orange-600" },
    greaterOrEqual: { icon: ChevronRight, variant: "outline" as const, color: "text-purple-600" },
    between: { icon: MoreHorizontal, variant: "outline" as const, color: "text-indigo-600" },
    notBetween: { icon: EyeOff, variant: "outline" as const, color: "text-indigo-600" },
    contains: { icon: Search, variant: "outline" as const, color: "text-gray-600" },
    notContains: { icon: EyeOff, variant: "outline" as const, color: "text-gray-600" },
    regex: { icon: Code, variant: "outline" as const, color: "text-violet-600" }
  };

  const config = operatorConfig[operator as keyof typeof operatorConfig];
  const Icon = config?.icon || Equal;
  
  return (
    <Badge variant={config?.variant || "outline"} className={`${config?.color || "text-gray-600"} gap-1`}>
      <Icon className="h-3 w-3" />
      {operatorLabels[operator as keyof typeof operatorLabels] || operator}
    </Badge>
  );
};

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [configurations, setConfigurations] = useState<AlertConfiguration[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newConfig, setNewConfig] = useState<Partial<AlertConfiguration>>({
    name: "",
    type: "controllerStatus",
    condition: "Warning",
    operator: "equal",
    value: "",
    secondValue: "",
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

    if (!newConfig.value) {
      toast({
        title: "Missing information",
        description: "Please provide a value for the condition.",
        variant: "destructive"
      });
      return;
    }

    if ((newConfig.operator === "between" || newConfig.operator === "notBetween") && !newConfig.secondValue) {
      toast({
        title: "Missing information",
        description: "Please provide both values for the between/not between condition.",
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
      operator: newConfig.operator || "equal",
      value: newConfig.value || "",
      secondValue: newConfig.secondValue || "",
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
      `Alert configuration has been created to monitor ${completeConfig.type} with condition: ${completeConfig.operator} ${completeConfig.value}${completeConfig.secondValue ? ` and ${completeConfig.secondValue}` : ''}`,
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
      operator: "equal",
      value: "",
      secondValue: "",
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

  const handleFieldTypeChange = (type: string) => {
    const fieldConfig = fieldTypes[type as keyof typeof fieldTypes];
    const defaultOperator = fieldConfig.operators[0];
    
    setNewConfig({
      ...newConfig, 
      type: type as AlertConfiguration["type"],
      operator: defaultOperator,
      value: "",
      secondValue: "",
      condition: type === "controllerStatus" || type === "aiStatus" ? "Warning" : ""
    });
  };

  const handleOperatorChange = (operator: string) => {
    setNewConfig({
      ...newConfig,
      operator,
      secondValue: (operator === "between" || operator === "notBetween") ? "" : undefined
    });
  };

  const getAvailableOperators = (fieldType: string) => {
    return fieldTypes[fieldType as keyof typeof fieldTypes]?.operators || ["equal"];
  };

  const getConditionDescription = (config: AlertConfiguration) => {
    if (config.operator === "between" || config.operator === "notBetween") {
      return `${config.value} and ${config.secondValue}`;
    }
    return config.value;
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
                    <TableHead>Field</TableHead>
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
                          {config.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-center gap-2">
                          {getOperatorBadge(config.operator)}
                          <span className="text-sm text-muted-foreground">
                            {getConditionDescription(config)}
                          </span>
                        </div>
                      </TableCell>
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
        <DialogContent className="sm:max-w-[600px]">
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
              <Label className="text-right" htmlFor="type">Field</Label>
              <Select value={newConfig.type} onValueChange={handleFieldTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select field to monitor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="controllerStatus">Controller Status</SelectItem>
                  <SelectItem value="aiStatus">AI Status</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="pressure">Pressure</SelectItem>
                  <SelectItem value="serialNumber">Serial Number</SelectItem>
                  <SelectItem value="partNumber">Part Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="operator">Operator</Label>
              <Select value={newConfig.operator} onValueChange={handleOperatorChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableOperators(newConfig.type || "controllerStatus").map(op => (
                    <SelectItem key={op} value={op}>
                      {operatorLabels[op as keyof typeof operatorLabels]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(newConfig.type === "controllerStatus" || newConfig.type === "aiStatus") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="condition">Status Value</Label>
                <Select value={newConfig.value} onValueChange={(value) => setNewConfig({...newConfig, value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newConfig.type !== "controllerStatus" && newConfig.type !== "aiStatus" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="value">Value</Label>
                <Input 
                  id="value" 
                  className="col-span-3" 
                  value={newConfig.value} 
                  onChange={(e) => setNewConfig({...newConfig, value: e.target.value})}
                  placeholder={fieldTypes[newConfig.type as keyof typeof fieldTypes]?.type === "number" ? "Enter number" : "Enter text"}
                  type={fieldTypes[newConfig.type as keyof typeof fieldTypes]?.type === "number" ? "number" : "text"}
                />
              </div>
            )}

            {(newConfig.operator === "between" || newConfig.operator === "notBetween") && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="secondValue">Second Value</Label>
                <Input 
                  id="secondValue" 
                  className="col-span-3" 
                  value={newConfig.secondValue} 
                  onChange={(e) => setNewConfig({...newConfig, secondValue: e.target.value})}
                  placeholder="Enter second value for range"
                  type="number"
                />
              </div>
            )}

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
