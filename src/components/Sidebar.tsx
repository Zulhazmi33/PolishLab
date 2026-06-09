import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRightIcon } from "../assets/SVG/General_icon";
import { navItems } from "../constant/navItems"

// ------------------------------------------ TYPES ------------------------------------------
type SubSubItem = {
  label: string;
  href: string;
};
type SubItem = {
  label: string;
  href?: string;
  subItems?: SubSubItem[];
};
type SidebarItemProps = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: SubItem[];
  className?: string;
  onNavigate?: () => void;
};


// ------------------------------------------ ITEM ------------------------------------------
const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, href, subItems, className, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const hasSubItems = subItems && subItems.length > 0;
  const isActive = href && location.pathname === href;

  const content = (
    <div
      className={`
        "flex items-center justify-between w-full gap-3 px-4 py-3 text-gray-200 hover:bg-secondary rounded-lg transition-all duration-300",
        ${isActive &&
            "bg-secondary text-white"
        } 
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );

  return (
    <li className={className}>
      {href && !hasSubItems ? (
        <Link to={href} onClick={onNavigate}>{content}</Link>
      ) : (
        <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">{content}</button>
      )}
    </li>
  );
};


// ------------------------------------------ SIDEBAR ------------------------------------------
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  return (
    <>
      <aside
        className={`
            fixed top-16 bottom-0 left-0 w-44 md:w-64 bg-primary z-30 transform transition-all duration-500 ease-in-out
            ${isOpen ?   "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"}
        `}
      >
        <nav className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <ul className="space-y-2">

            {/* 1) loop through all sidebar's item */}
            {navItems.map((item, idx) => (
              <SidebarItem key={idx} {...item} onNavigate={onClose} />
            ))}

            {/* 2) 'logout' only */}
            <li className="pt-4 mt-4 border-t-2 border-border">
              <button className="w-full text-left">
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-title hover:bg-secondary rounded-lg transition-all duration-300">
                    <ArrowRightIcon/>
                    <span className="font-medium">Log out</span>
                </div>
              </button>
            </li>

          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;