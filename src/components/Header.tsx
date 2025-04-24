
import React from "react";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo iconSize={32} textSize="text-xl" />
          </Link>
          
          <Avatar>
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
