
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for model performance
const performanceData = [
  { date: "2025-01", accuracy: 76, precision: 72, recall: 68 },
  { date: "2025-02", accuracy: 82, precision: 78, recall: 74 },
  { date: "2025-03", accuracy: 85, precision: 82, recall: 80 },
  { date: "2025-04", accuracy: 89, precision: 86, recall: 84 },
  { date: "2025-05", accuracy: 91, precision: 90, recall: 87 },
  { date: "2025-06", accuracy: 94, precision: 92, recall: 90 },
];

const confusionMatrix = [
  { name: "True Positive", value: 856 },
  { name: "False Positive", value: 42 },
  { name: "False Negative", value: 67 },
  { name: "True Negative", value: 935 },
];

export const ModelPerformance = () => {
  const [selectedModel, setSelectedModel] = useState("model-1");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Model Performance Dashboard</h2>
        
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model-1">Production Anomaly Detector</SelectItem>
            <SelectItem value="model-2">Quality Control Classifier</SelectItem>
            <SelectItem value="model-3">Maintenance Predictor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-primary">94.7%</div>
            <p className="text-sm text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Precision</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-secondary">92.1%</div>
            <p className="text-sm text-muted-foreground">+1.8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Recall</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold text-tertiary">90.5%</div>
            <p className="text-sm text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="trends">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Performance Metrics Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="precision"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="recall"
                      stroke="hsl(var(--tertiary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confusion" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={confusionMatrix}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
