import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import LeftPanel from "./LeftPanel";
import CentralSection from "./CentralSection";
import RightPanel from "./RightPanel";
import SettingsButton from "./SettingsButton";
import SignUpButton from "../Auth/SignUpButton";

interface DashboardLayoutProps {
  className?: string;
}

const DashboardLayout = ({ className }: DashboardLayoutProps = {}) => {
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
    <div
      className={cn(
        "min-h-screen bg-background text-foreground transition-colors duration-200",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Settings and Sign Up */}
        <div className="flex justify-end items-center gap-4 mb-6">
          <SignUpButton />
          <SettingsButton darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-150px)]">
          {/* Left Panel */}
          <div className="md:col-span-3 border border-border/30 rounded-md overflow-hidden shadow-sm">
            <LeftPanel />
          </div>

          {/* Central Section */}
          <div className="md:col-span-6 flex items-center justify-center">
            <CentralSection />
          </div>

          {/* Right Panel */}
          <div className="md:col-span-3 border border-border/30 rounded-md overflow-hidden shadow-sm">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
