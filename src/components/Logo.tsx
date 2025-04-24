
import React from 'react';
import { Diamond, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Custom text to display next to the icon */
  text?: string;
  /** Custom icon component from lucide-react */
  icon?: LucideIcon;
  /** Icon size in pixels */
  iconSize?: number;
  /** Text size class (e.g., 'text-lg', 'text-xl') */
  textSize?: string;
  /** Icon color class (e.g., 'text-primary', 'text-blue-500') */
  iconColor?: string;
  /** Text color class (e.g., 'text-gray-800', 'text-white') */
  textColor?: string;
  /** Additional className for the container */
  className?: string;
}

export const Logo = ({
  text = 'ManufactureAI',
  icon: Icon = Diamond,
  iconSize = 32,
  textSize = 'text-lg',
  iconColor = 'text-primary',
  textColor = 'text-gray-800',
  className,
}: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className={cn(`h-${iconSize / 4} w-${iconSize / 4}`, iconColor)} />
      <span className={cn('font-bold', textSize, textColor)}>{text}</span>
    </div>
  );
};
