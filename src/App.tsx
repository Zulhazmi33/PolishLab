import { useState } from "react";
import Header from "./components/Header"
import Sidebar from "./components/Sidebar";
import TabBar from "./components/TabBar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Setting from "./pages/Setting";
import Paragraph from "./pages/Paragraph";
import Resume from "./pages/Resume";
import Budget from "./pages/Budget";

function App() {

  // ------------------------------------------ 1) Sidebar ------------------------------------------
    // useState
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  
    // ON
    const openSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
    }
    // OFF
    const closeSidebar = () => {
      setIsSidebarOpen(false)
    }  
      
  
  return (
    <>      
      <div className="min-h-screen bg-body">
        <>
          <Header onMenuClick={openSidebar} isSidebarOpen={isSidebarOpen}/>

          {/* Sidebar: md and above only */}
          <div className="hidden md:block">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          </div>

          {/* TabBar: mobile only */}
          <div className="block md:hidden">
            <TabBar />
          </div>
        </>

        {/* IMPORTANT: push content below fixed header */}
        <main className="pt-24 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/paragraph" element={<Paragraph />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </main>
      </div>

    </>
  )

}

export default App
