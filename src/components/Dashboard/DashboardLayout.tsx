import React, { useState, useEffect } from "react";
import { Moon, Sun, LogOut, UserCircle } from "lucide-react";
import LeftPanel from "./LeftPanel";
import CentralSection from "./CentralSection";
import RightPanel from "./RightPanel";
import SignUpButton from "../Auth/SignUpButton";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUser } from "../../contexts/UserContext.jsx";

interface DashboardLayoutProps {
  className?: string;
}

const DashboardLayout = ({ className = "" }: DashboardLayoutProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const { user, signOut } = useUser();

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await signOut();
    // No need to redirect, the Auth component's useEffect will handle that
  };

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${className}`}>
      <div className="w-full px-3 py-4 md:px-6 md:py-8 max-w-[1920px] mx-auto">
        {/* Header with Sign Up/Sign Out and Dark Mode Toggle */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch 
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-primary"
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 text-muted-foreground"
              >
                <UserCircle className="h-4 w-4" />
                <span className="max-w-[100px] truncate">
                  {user.email?.split('@')[0]}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-none bg-background/50 text-foreground hover:bg-muted rounded-full"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <SignUpButton />
          )}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel */}
          <div className="md:col-span-3 border border-border/40 rounded-xl overflow-hidden shadow-sm bg-card/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md">
            <LeftPanel initialLinks={[]} />
          </div>

          {/* Central Section */}
          <div className="md:col-span-6 flex items-center justify-center">
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
