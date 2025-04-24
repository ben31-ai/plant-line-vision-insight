
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Factory, AlertTriangle, Server } from "lucide-react";

export const Recommendations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="bg-green-100 p-2 rounded">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Improve Line 3 Efficiency</h3>
              <p className="text-sm text-muted-foreground">Current efficiency is below target. Schedule maintenance and calibration.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-blue-100 p-2 rounded">
              <Factory className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Scale Production on Line 2</h3>
              <p className="text-sm text-muted-foreground">Line 2 is operating at optimal efficiency. Consider increasing workload.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-amber-100 p-2 rounded">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">Quality Check Alert</h3>
              <p className="text-sm text-muted-foreground">Recent increase in defects reported on Line 1. Schedule quality assessment.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-purple-100 p-2 rounded">
              <Server className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">System Optimization</h3>
              <p className="text-sm text-muted-foreground">Database performance could be improved to reduce process cycle time.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
