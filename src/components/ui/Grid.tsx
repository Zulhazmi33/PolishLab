// Grid.tsx
import React from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export default function Grid({ children, className = "" }: GridProps) {
  return (
    <div className={`grid grid-cols-1 gap-10 pl-10 pr-10 mb-10 ${className}`}>
      {children}
    </div>
  );
}
