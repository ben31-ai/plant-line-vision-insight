
import React from "react";
import { Link } from "react-router-dom";
import { BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getNotificationCount, resetNotificationCount } from "@/utils/alertUtils";

export const AlertNotificationBell: React.FC = () => {
  const [count, setCount] = React.useState(getNotificationCount());
  
  React.useEffect(() => {
    // Update count every 5 seconds
    const interval = setInterval(() => {
      setCount(getNotificationCount());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleClick = () => {
    // Reset the notification count when clicked
    resetNotificationCount();
    setCount(0);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/alerts" onClick={handleClick}>
            <Button variant="ghost" size="icon" className="relative">
              <BellRing className="h-5 w-5" />
              {count > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
                >
                  {count > 99 ? '99+' : count}
                </Badge>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Alerts ({count})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
