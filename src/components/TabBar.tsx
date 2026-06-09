import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../constant/navItems";

// ------------------------------------------ TAB BAR ------------------------------------------
const TabBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-primary border-t border-border md:hidden">
      <ul className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <li key={item.href} className="flex-1">
                <Link
                    to={item.href}
                    className={`
                        flex flex-col items-center justify-center gap-1 h-full w-full px-1 transition-all duration-300 rounded-lg
                        ${isActive  ? "text-white" : "text-gray-400 hover:text-gray-200"}
                    `}>

                    {/* 1) Icon — add a pill background when active */}
                    <span className={`flex items-center justify-center w-14 h-6 rounded-full transition-all duration-300 text-title
                                    ${isActive ? "bg-secondary" : ""}`}>
                        {item.icon}
                    </span>

                    {/* 2) Label */}
                    <span className={`text-[14px] font-medium leading-none transition-all duration-300 text-title
                                    ${isActive ? "opacity-100" : "opacity-60"}`}>
                        {item.label}
                    </span>
                </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabBar;