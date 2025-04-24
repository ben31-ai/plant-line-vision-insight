
import React from 'react';
import { Diamond } from 'lucide-react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Diamond className="h-8 w-8 text-primary" />
      <span className="font-bold text-lg text-gray-800">ManufactureAI</span>
    </div>
  );
};
