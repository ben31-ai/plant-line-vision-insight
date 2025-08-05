
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, X, Settings, Target, Hash, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

export interface AlertData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  // Nouvelles propriétés pour plus de détails
  configurationName?: string;
  field?: string;
  evaluationMode?: "perProduct" | "aggregated" | "timeBased";
  operator?: string;
  threshold?: string | number;
  actualValue?: string | number;
  productId?: string;
  aggregationType?: string;
  timeInterval?: number;
}

interface AlertBannerProps {
  alerts: AlertData[];
  onDismiss: (id: string) => void;
}

const evaluationModeLabels = {
  perProduct: "Par Produit",
  aggregated: "Agrégé", 
  timeBased: "Temporel"
};

const operatorLabels = {
  equal: "=",
  notEqual: "≠",
  greater: ">",
  less: "<",
  lessOrEqual: "≤",
  greaterOrEqual: "≥",
  between: "entre",
  notBetween: "pas entre",
  contains: "contient",
  notContains: "ne contient pas",
  regex: "regex"
};

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  if (!alerts.length) return null;
  
  const getAlertVariant = (type: AlertData["type"]) => {
    switch (type) {
      case "error": return "destructive";
      case "warning": return "default";
      default: return "default";
    }
  };

  const getAlertIcon = (type: AlertData["type"]) => {
    switch (type) {
      case "error": return <AlertCircle className="h-5 w-5" />;
      case "warning": return <AlertCircle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getFieldDisplayName = (field?: string) => {
    const fieldNames = {
      controllerStatus: "Statut Contrôleur",
      aiStatus: "Statut IA",
      temperature: "Température",
      pressure: "Pression",
      serialNumber: "Numéro de Série",
      partNumber: "Référence Pièce"
    };
    return field ? fieldNames[field as keyof typeof fieldNames] || field : "Champ inconnu";
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="space-y-4 mb-6">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${
          alert.type === "error" ? "border-l-red-500" : 
          alert.type === "warning" ? "border-l-yellow-500" : 
          alert.type === "success" ? "border-l-green-500" : 
          "border-l-blue-500"
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-lg">{alert.title}</h4>
                    <Badge variant={alert.type === "error" ? "destructive" : "outline"}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.message}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDismiss(alert.id)} 
                className="h-8 w-8 p-0 shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Ignorer</span>
              </Button>
            </div>
          </CardHeader>
          
          {/* Section détaillée des informations de configuration */}
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg">
              
              {/* Configuration */}
              {alert.configurationName && (
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Configuration</div>
                    <div className="text-sm font-medium truncate">{alert.configurationName}</div>
                  </div>
                </div>
              )}

              {/* Champ surveillé */}
              {alert.field && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Champ</div>
                    <div className="text-sm font-medium">{getFieldDisplayName(alert.field)}</div>
                  </div>
                </div>
              )}

              {/* Mode d'évaluation */}
              {alert.evaluationMode && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Mode</div>
                    <div className="text-sm font-medium">
                      {evaluationModeLabels[alert.evaluationMode]}
                      {alert.evaluationMode === "timeBased" && alert.timeInterval && (
                        <span className="text-xs text-muted-foreground ml-1">({alert.timeInterval}m)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Condition / Seuil */}
              {alert.operator && alert.threshold !== undefined && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Condition</div>
                    <div className="text-sm font-medium">
                      {operatorLabels[alert.operator as keyof typeof operatorLabels] || alert.operator} {alert.threshold}
                      {alert.aggregationType && (
                        <span className="text-xs text-muted-foreground ml-1">({alert.aggregationType})</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Section produit et valeur en défaut */}
            {(alert.productId || alert.actualValue !== undefined) && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-800/20 rounded-lg">
                
                {/* ID du produit */}
                {alert.productId && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-red-600" />
                    <div className="min-w-0">
                      <div className="text-xs text-red-700 dark:text-red-300">Produit en défaut</div>
                      <div className="text-sm font-mono font-medium text-red-800 dark:text-red-200">
                        {alert.productId}
                      </div>
                    </div>
                  </div>
                )}

                {/* Valeur actuelle qui pose problème */}
                {alert.actualValue !== undefined && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <div className="min-w-0">
                      <div className="text-xs text-red-700 dark:text-red-300">Valeur mesurée</div>
                      <div className="text-sm font-medium text-red-800 dark:text-red-200">
                        {alert.actualValue}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
