import React from 'react';
import { Sidebar_closeIcon, Sidebar_openIcon } from '../assets/SVG/General_icon';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {

    console.log('test = ',localStorage.getItem('theme'))
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
                        {localStorage.getItem('theme')=='light' ? (
                            <img
                                src="/RefineLab_rectangle_dark.png"
                                alt="BuyMe logo"
                                className="h-14 object-cover"
                            />
                        ) : (

                            <img
                                src="/RefineLab_rectangle_light.png"
                                alt="BuyMe logo"
                                className="h-14 object-cover"
                            />
                        )}
                    </div>

                </div>
            </header>
        </div>
    );
};

export default Header;