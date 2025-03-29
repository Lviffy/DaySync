import React, { useState, useEffect } from "react";
import LeftPanel from "./LeftPanel";
import CentralSection from "./CentralSection";
import RightPanel from "./RightPanel";
import SettingsButton from "./SettingsButton";
import SignUpButton from "../Auth/SignUpButton";

interface DashboardLayoutProps {
  className?: string;
}

const DashboardLayout = ({ className = "" }: DashboardLayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${className}`}>
      <div className="w-full px-3 py-4 md:px-6 md:py-8 max-w-[1920px] mx-auto">
        {/* Header with Settings and Sign Up */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <SignUpButton />
          <SettingsButton darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel */}
          <div className="md:col-span-3 border border-border/40 rounded-xl overflow-hidden shadow-sm bg-card/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md">
            <LeftPanel initialLinks={[]} />
          </div>

          {/* Central Section */}
          <div className="md:col-span-6 flex items-center justify-center rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md">
            <CentralSection />
          </div>

          {/* Right Panel */}
          <div className="md:col-span-3 border border-border/40 rounded-xl overflow-hidden shadow-sm bg-card/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
