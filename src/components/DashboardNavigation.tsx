
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Brain, BarChart, Bell } from "lucide-react";

export const DashboardNavigation: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Link to="/kpi-dashboard">
        <Button variant="outline" className="gap-2">
          <BarChart className="h-4 w-4" />
          KPI Dashboard
        </Button>
      </Link>
      <Link to="/ai-modeling">
        <Button variant="outline" className="gap-2">
          <Brain className="h-4 w-4" />
          AI Modeling Platform
        </Button>
      </Link>
      <Link to="/alerts">
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Manage Alerts
        </Button>
      </Link>
    </div>
  );
};
