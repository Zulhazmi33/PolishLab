import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className }: CardProps) {
  return (
    <div className={`rounded-xl shadow-black shadow-xs overflow-hidden ${className}`}>
        {/* 1) title */}
        { title && (
          <div className="px-5 py-4 bg-primary">
              <h2 className="text-base font-bold text-title text-center">{title}</h2>
          </div>
        )}
        {/* 2) body */}
        <div className="p-5 bg-white">
            {children}
        </div>
    </div>
  );
}
