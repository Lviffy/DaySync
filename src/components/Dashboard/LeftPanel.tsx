import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { PlusCircle, Link as LinkIcon, ExternalLink, X } from "lucide-react";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

interface LeftPanelProps {
  className?: string;
  initialLinks?: QuickLink[];
}

const LeftPanel = ({
  className,
  initialLinks = [],
}: LeftPanelProps) => {
  // State for quick links
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(initialLinks);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newLink, setNewLink] = useState<Partial<QuickLink>>({
    title: "",
    url: "",
  });

  // Calendar state and functions
  const currentDate = new Date();
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  // Get days in current month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Navigate to previous month
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

    // Add day names
    dayNames.forEach((day, index) => {
      days.push(
        <div
          key={`dayname-${index}`}
          className="h-7 w-7 flex items-center justify-center text-xs font-medium"
        >
          {day}
        </div>,
      );
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-7 w-7 flex items-center justify-center"
        ></div>,
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDate.getDate() &&
        viewMonth === currentDate.getMonth() &&
        viewYear === currentDate.getFullYear();
      days.push(
        <div
          key={`day-${viewMonth}-${day}`}
          className={cn(
            "h-7 w-7 flex items-center justify-center text-xs rounded-full hover:bg-muted/60 cursor-pointer transition-colors",
            isToday && "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  // Get domain from URL
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      // If URL is invalid, try adding https:// and try again
      try {
        if (!url.startsWith("http")) {
          const urlObj = new URL(`https://${url}`);
          return urlObj.hostname;
        }
      } catch (e) {
        // If still invalid, return the original URL
        return url;
      }
      return url;
    }
  };

  // Get favicon URL
  const getFaviconUrl = (url: string) => {
    try {
      const domain = getDomain(url);
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return null;
    }
  };

  // Add new quick link
  const addQuickLink = () => {
    if (!newLink.title || !newLink.url) return;

    // Ensure URL has protocol
    let url = newLink.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const link: QuickLink = {
      id: Date.now().toString(),
      title: newLink.title,
      url: url,
      favicon: getFaviconUrl(url),
    };

    setQuickLinks([...quickLinks, link]);
    setNewLink({ title: "", url: "" });
    setIsAddLinkOpen(false);
  };

  // Remove quick link
  const removeQuickLink = (id: string) => {
    setQuickLinks(quickLinks.filter((link) => link.id !== id));
  };

  // Open link in new tab
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className={cn(
        "w-full h-full p-3 md:p-5 flex flex-col gap-4 md:gap-6 overflow-auto",
        className,
      )}
    >
      {/* Calendar Widget */}
      <div className="p-4 bg-background/80 rounded-lg shadow-sm border border-border/30 transition-all duration-200 hover:shadow-md">
        <div className="flex justify-between items-center mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            className="px-2 h-7 hover:bg-primary/10 hover:text-primary"
          >
            &lt;
          </Button>
          <h2 className="text-base md:text-lg font-medium text-foreground/90">
            {monthNames[viewMonth]} {viewYear}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="px-2 h-7 hover:bg-primary/10 hover:text-primary"
          >
            &gt;
          </Button>
        </div>

        <div className="grid grid-cols-7 place-items-center gap-1 max-w-[280px] mx-auto text-sm">
          {generateCalendarDays()}
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-4 bg-background/80 rounded-lg shadow-sm border border-border/30 flex-1 transition-all duration-200 hover:shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base md:text-lg font-medium text-foreground/90">Quick Links</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddLinkOpen(true)}
            className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Add
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickLinks.map((link) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-md bg-background/60 hover:bg-primary/5 border border-border/30 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1 text-primary group-hover:bg-primary/20 transition-colors">
                <LinkIcon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-center line-clamp-1">{link.title}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeQuickLink(link.id);
                }}
                className="absolute top-0 right-0 w-5 h-5 rounded-full bg-background/80 text-foreground/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </a>
          ))}
        </div>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent className="bg-background border border-border/50 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Quick Link</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newLink.title}
                onChange={(e) =>
                  setNewLink({ ...newLink, title: e.target.value })
                }
                className="col-span-3 border-border/40"
                placeholder="Google"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="url" className="text-right text-sm font-medium">
                URL
              </label>
              <Input
                id="url"
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
                className="col-span-3 border-border/40"
                placeholder="google.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddLinkOpen(false)}
              className="border-border/40"
            >
              Cancel
            </Button>
            <Button
              onClick={addQuickLink}
              disabled={!newLink.title || !newLink.url}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftPanel;
