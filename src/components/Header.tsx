import React, { useEffect, useState } from 'react';
import { Sidebar_closeIcon, Sidebar_openIcon } from '../assets/SVG/General_icon';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);
    return (
        <div>
            <header className="bg-primary shadow-md fixed top-0 left-0 right-0 z-40 h-16 border border-border">
                <div className="h-full px-4 flex items-center justify-between">

                    {/* LEFT — sidebar toggle */}
                    <div className="flex items-center gap-4">
                        {/* a) sidebar */}
                        <div className="hidden md:block"> {/* 👈 hide if using 'mobile' */}
                            <button
                                onClick={onMenuClick}
                                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                                className=" p-2 rounded-lg transition-colors hover:cursor-pointer focus:outline-none focus:ring-4
                                            focus:ring-secondary bg-white hover:bg-gray-100"
                            >
                                {isSidebarOpen ? <Sidebar_closeIcon /> : <Sidebar_openIcon />}
                            </button>
                        </div>
                        {/* b) image */}
                        <img
                            src={isDark ? "/RefineLab_rectangle_dark.png" : "/RefineLab_rectangle_light.png"}
                            alt="FinanceFlow logo"
                            className="h-14 object-cover"
                        />
                    </div>

                </div>
            </header>
        </div>
    );
};

export default Header;