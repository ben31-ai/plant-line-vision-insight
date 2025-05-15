
import React from "react";
import { Header as OriginalHeader } from "./Header";
import { AlertNotificationBell } from "./AlertNotificationBell";

export const Header: React.FC = () => {
  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Original Header Content */}
        <div className="flex-1">
          <OriginalHeader />
        </div>
        
        {/* Alert Bell */}
        <div className="ml-auto">
          <AlertNotificationBell />
        </div>
      </div>
    </div>
  );
};
