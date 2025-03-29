import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CentralSectionProps {
  className?: string;
}

const CentralSection = ({ className = "" }: CentralSectionProps) => {
  const [time, setTime] = useState<string>("00:00");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Update the time every second
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    // Initial call to set the time immediately
    updateTime();

    // Set up interval to update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on component unmount
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
        "flex flex-col items-center justify-center p-8 bg-background",
        className,
      )}
    >
      {/* Digital Clock */}
      <div className="mb-10">
        <h1 className="text-9xl font-light tracking-tight">{time}</h1>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-md relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-12 pl-10 pr-4 border border-border/30 rounded-full focus:outline-none focus:ring-0 focus:border-primary bg-background/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </form>
    </div>
  );
};

export default CentralSection;
