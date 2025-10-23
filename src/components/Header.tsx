
import React from "react";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo iconSize={32} textSize="text-xl" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
