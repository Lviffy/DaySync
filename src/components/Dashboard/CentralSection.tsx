import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CentralSectionProps {
  className?: string;
}

const CentralSection = ({ className }: CentralSectionProps) => {
  const [time, setTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Update the time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Change to 24-hour format
      setTime(now.toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: false // Use 24-hour format
      }));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Open Google search in a new tab
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full p-6 md:p-10",
        className,
      )}
    >
      {/* Digital Clock - changed to black and white */}
      <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 -mt-[60px]">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-foreground dark:text-white">{time}</h1>
      </div>

      {/* Search Bar */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150"
      >
        <div className="relative group">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search the web..."
            className="pl-10 pr-12 h-12 rounded-full border-border/50 bg-background/80 backdrop-blur-sm shadow-sm focus-visible:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-80 group-hover:opacity-100"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CentralSection;
