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
  resetAlertCount,
  AlertConfiguration
} from "@/utils/alertUtils";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, BellRing, AlertTriangle, Equal, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, MoreHorizontal, X, Code, EyeOff, Building, Zap, Wrench, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { plants, lines, stations, programs, parts } from "@/utils/mockData";

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

const evaluationModeLabels = {
  perProduct: "Per Product",
  aggregated: "Aggregated", 
  timeBased: "Time-based"
};

const aggregationTypeLabels = {
  count: "Count",
  average: "Average",
  min: "Minimum",
  max: "Maximum",
  percentage: "Percentage"
};

const timeIntervalOptions = [
  { value: 1, label: "1 minute" },
  { value: 5, label: "5 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 240, label: "4 hours" },
  { value: 1440, label: "24 hours" }
];

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
  
  // Filtres de localisation
  const [filterPlantId, setFilterPlantId] = useState<string>("");
  const [filterLineId, setFilterLineId] = useState<string>("");
  const [filterStationId, setFilterStationId] = useState<string>("");
  const [filterProgramId, setFilterProgramId] = useState<string>("");
  const [filterPartId, setFilterPartId] = useState<string>("");
  
  const [newConfig, setNewConfig] = useState<Partial<AlertConfiguration>>({
    name: "",
    type: "controllerStatus",
    condition: "Warning",
    operator: "equal",
    value: "",
    secondValue: "",
    emails: [""],
    enabled: true,
    muted: false,
    evaluationMode: "perProduct",
    timeInterval: 5,
    aggregationType: "count",
    aggregationThreshold: 1,
    plantId: "",
    lineId: "",
    stationId: "",
    programId: "",
    partId: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    setAlerts(getGlobalAlerts());
    setConfigurations(getAlertConfigurations());
  }, []);

  // Fonctions de filtrage
  const getFilteredConfigurations = () => {
    return configurations.filter(config => {
      if (filterPlantId && config.plantId && config.plantId !== filterPlantId) return false;
      if (filterLineId && config.lineId && config.lineId !== filterLineId) return false;
      if (filterStationId && config.stationId && config.stationId !== filterStationId) return false;
      if (filterProgramId && config.programId && config.programId !== filterProgramId) return false;
      if (filterPartId && config.partId && config.partId !== filterPartId) return false;
      return true;
    });
  };

  const getFilteredAlerts = () => {
    // Pour l'instant, on retourne toutes les alertes car elles n'ont pas de propriétés de localisation
    // Dans une implémentation complète, les alertes auraient aussi des propriétés de localisation
    return alerts;
  };

  const getAvailableFilterLines = () => {
    if (!filterPlantId) return [];
    return lines.filter(line => line.plantId === filterPlantId);
  };

  const getAvailableFilterStations = () => {
    if (!filterLineId) return [];
    return stations.filter(station => station.lineId === filterLineId);
  };

  const clearAllFilters = () => {
    setFilterPlantId("");
    setFilterLineId("");
    setFilterStationId("");
    setFilterProgramId("");
    setFilterPartId("");
  };

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

    if (newConfig.evaluationMode === "aggregated" && (newConfig.aggregationThreshold === undefined || newConfig.aggregationThreshold < 1)) {
      toast({
        title: "Missing information",
        description: "Please provide a valid aggregation threshold for aggregated mode.",
        variant: "destructive"
      });
      return;
    }

    if (newConfig.evaluationMode === "timeBased" && (!newConfig.timeInterval || newConfig.timeInterval < 1)) {
      toast({
        title: "Missing information",
        description: "Please provide a valid time interval for time-based mode.",
        variant: "destructive"
      });
      return;
    }

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
      triggerCount: 0,
      evaluationMode: newConfig.evaluationMode || "perProduct",
      timeInterval: newConfig.timeInterval,
      aggregationType: newConfig.aggregationType,
      aggregationThreshold: newConfig.aggregationThreshold,
      plantId: newConfig.plantId || undefined,
      lineId: newConfig.lineId || undefined,
      stationId: newConfig.stationId || undefined,
      programId: newConfig.programId || undefined,
      partId: newConfig.partId || undefined
    };

    saveAlertConfiguration(completeConfig);
    setConfigurations([...configurations, completeConfig]);
    
    const testAlert = createAlert(
      `${completeConfig.name} Created`, 
      `Alert configuration has been created to monitor ${completeConfig.type} in ${completeConfig.evaluationMode} mode`,
      "info"
    );
    setGlobalAlert(testAlert);
    setAlerts([...alerts, testAlert]);
    
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
      muted: false,
      evaluationMode: "perProduct",
      timeInterval: 5,
      aggregationType: "count",
      aggregationThreshold: 1,
      plantId: "",
      lineId: "",
      stationId: "",
      programId: "",
      partId: ""
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

  const handleEvaluationModeChange = (mode: string) => {
    setNewConfig({
      ...newConfig,
      evaluationMode: mode as AlertConfiguration["evaluationMode"],
      timeInterval: mode === "timeBased" ? 5 : undefined,
      aggregationType: mode === "aggregated" ? "count" : undefined,
      aggregationThreshold: mode === "aggregated" ? 1 : undefined
    });
  };

  const getAvailableLines = () => {
    if (!newConfig.plantId) return [];
    return lines.filter(line => line.plantId === newConfig.plantId);
  };

  const getAvailableStations = () => {
    if (!newConfig.lineId) return [];
    return stations.filter(station => station.lineId === newConfig.lineId);
  };

  const getLocationBadges = (config: AlertConfiguration) => {
    const badges = [];
    
    if (config.plantId) {
      const plant = plants.find(p => p.id === config.plantId);
      if (plant) {
        badges.push(
          <Badge key="plant" variant="secondary" className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            {plant.name}
          </Badge>
        );
      }
    }
    
    if (config.lineId) {
      const line = lines.find(l => l.id === config.lineId);
      if (line) {
        badges.push(
          <Badge key="line" variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {line.name}
          </Badge>
        );
      }
    }
    
    if (config.stationId) {
      const station = stations.find(s => s.id === config.stationId);
      if (station) {
        badges.push(
          <Badge key="station" variant="secondary" className="flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            {station.name}
          </Badge>
        );
      }
    }
    
    if (config.programId) {
      const program = programs.find(p => p.id === config.programId);
      if (program) {
        badges.push(
          <Badge key="program" variant="outline">
            {program.name}
          </Badge>
        );
      }
    }
    
    if (config.partId) {
      const part = parts.find(p => p.id === config.partId);
      if (part) {
        badges.push(
          <Badge key="part" variant="outline">
            {part.name}
          </Badge>
        );
      }
    }
    
    return badges;
  };

  const filteredConfigurations = getFilteredConfigurations();
  const filteredAlerts = getFilteredAlerts();

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

        {/* Filtres de localisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Location Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-sm">Plant</Label>
                <Select value={filterPlantId || "all"} onValueChange={(value) => {
                  const plantId = value === "all" ? "" : value;
                  setFilterPlantId(plantId);
                  setFilterLineId("");
                  setFilterStationId("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any plant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any plant</SelectItem>
                    {plants.map(plant => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Line</Label>
                <Select 
                  value={filterLineId || "all"} 
                  onValueChange={(value) => {
                    const lineId = value === "all" ? "" : value;
                    setFilterLineId(lineId);
                    setFilterStationId("");
                  }}
                  disabled={!filterPlantId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any line" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any line</SelectItem>
                    {getAvailableFilterLines().map(line => (
                      <SelectItem key={line.id} value={line.id}>
                        {line.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Station</Label>
                <Select 
                  value={filterStationId || "all"} 
                  onValueChange={(value) => setFilterStationId(value === "all" ? "" : value)}
                  disabled={!filterLineId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any station</SelectItem>
                    {getAvailableFilterStations().map(station => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Program</Label>
                <Select value={filterProgramId || "all"} onValueChange={(value) => setFilterProgramId(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any program</SelectItem>
                    {programs.map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Part</Label>
                <Select value={filterPartId || "all"} onValueChange={(value) => setFilterPartId(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any part" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any part</SelectItem>
                    {parts.map(part => (
                      <SelectItem key={part.id} value={part.id}>
                        {part.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Showing {filteredConfigurations.length} of {configurations.length} configurations
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <AlertBanner alerts={filteredAlerts} onDismiss={handleDismissAlert} />

        <div>
          <h2 className="text-lg font-medium mb-3">Alert Configurations</h2>
          <div className="border rounded-md">
            {filteredConfigurations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {configurations.length === 0 ? 
                  "No alert configurations yet. Create one to get started." :
                  "No alert configurations match the selected filters."
                }
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Location/Program</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Emails</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfigurations.map((config) => (
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
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {getLocationBadges(config).length > 0 ? 
                            getLocationBadges(config) : 
                            <span className="text-sm text-muted-foreground">All locations</span>
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary">
                            {evaluationModeLabels[config.evaluationMode]}
                          </Badge>
                          {config.evaluationMode === "timeBased" && config.timeInterval && (
                            <span className="text-xs text-muted-foreground">
                              Every {config.timeInterval}m
                            </span>
                          )}
                          {config.evaluationMode === "aggregated" && config.aggregationType && (
                            <span className="text-xs text-muted-foreground">
                              {aggregationTypeLabels[config.aggregationType]} ≥ {config.aggregationThreshold}
                            </span>
                          )}
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

        <div>
          <h2 className="text-lg font-medium mb-3">Current Alerts</h2>
          <div className="border rounded-md">
            {filteredAlerts.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No active alerts.
              </div>
            ) : (
              <AlertBanner alerts={filteredAlerts} onDismiss={handleDismissAlert} />
            )}
          </div>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Alert Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="name">Name</Label>
              <Input 
                id="name" 
                className="col-span-3" 
                value={newConfig.name} 
                onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
              <Label className="text-sm font-medium">Location and Program Filters (Optional)</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Plant</Label>
                  <Select value={newConfig.plantId || "all"} onValueChange={(value) => setNewConfig({...newConfig, plantId: value === "all" ? "" : value, lineId: "", stationId: ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any plant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any plant</SelectItem>
                      {plants.map(plant => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Line</Label>
                  <Select 
                    value={newConfig.lineId || "all"} 
                    onValueChange={(value) => setNewConfig({...newConfig, lineId: value === "all" ? "" : value, stationId: ""})}
                    disabled={!newConfig.plantId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any line" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any line</SelectItem>
                      {getAvailableLines().map(line => (
                        <SelectItem key={line.id} value={line.id}>
                          {line.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Station</Label>
                  <Select 
                    value={newConfig.stationId || "all"} 
                    onValueChange={(value) => setNewConfig({...newConfig, stationId: value === "all" ? "" : value})}
                    disabled={!newConfig.lineId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any station</SelectItem>
                      {getAvailableStations().map(station => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Program</Label>
                  <Select value={newConfig.programId || "all"} onValueChange={(value) => setNewConfig({...newConfig, programId: value === "all" ? "" : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any program</SelectItem>
                      {programs.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-sm">Part</Label>
                  <Select value={newConfig.partId || "all"} onValueChange={(value) => setNewConfig({...newConfig, partId: value === "all" ? "" : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any part</SelectItem>
                      {parts.map(part => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
              <Label className="text-right" htmlFor="evaluationMode">Evaluation Mode</Label>
              <Select value={newConfig.evaluationMode} onValueChange={handleEvaluationModeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select evaluation mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perProduct">Per Product - Check each product individually</SelectItem>
                  <SelectItem value="aggregated">Aggregated - Check across all products</SelectItem>
                  <SelectItem value="timeBased">Time-based - Check at regular intervals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newConfig.evaluationMode === "timeBased" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="timeInterval">Check Interval</Label>
                <Select value={newConfig.timeInterval?.toString()} onValueChange={(value) => setNewConfig({...newConfig, timeInterval: parseInt(value)})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select time interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeIntervalOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newConfig.evaluationMode === "aggregated" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="aggregationType">Aggregation Type</Label>
                  <Select value={newConfig.aggregationType} onValueChange={(value) => setNewConfig({...newConfig, aggregationType: value as AlertConfiguration["aggregationType"]})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select aggregation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="count">Count of matching products</SelectItem>
                      <SelectItem value="percentage">Percentage of matching products</SelectItem>
                      <SelectItem value="average">Average value</SelectItem>
                      <SelectItem value="min">Minimum value</SelectItem>
                      <SelectItem value="max">Maximum value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="aggregationThreshold">Threshold</Label>
                  <Input 
                    id="aggregationThreshold" 
                    className="col-span-3" 
                    type="number"
                    value={newConfig.aggregationThreshold || ''} 
                    onChange={(e) => setNewConfig({...newConfig, aggregationThreshold: parseFloat(e.target.value)})}
                    placeholder="Threshold value to trigger alert"
                  />
                </div>
              </>
            )}

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
