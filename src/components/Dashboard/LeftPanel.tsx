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
  initialLinks = [
    { id: "1", title: "Gmail", url: "https://gmail.com" },
    { id: "2", title: "Calendar", url: "https://calendar.google.com" },
    { id: "3", title: "Drive", url: "https://drive.google.com" },
  ],
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
    dayNames.forEach((day) => {
      days.push(
        <div
          key={`day-${day}`}
          className="h-8 flex items-center justify-center text-sm font-medium"
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
          className="h-8 flex items-center justify-center border border-border/30"
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
          key={`day-${day}`}
          className={cn(
            "h-8 flex items-center justify-center border border-border/30 text-sm hover:bg-muted cursor-pointer transition-colors",
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
        "w-full h-full p-4 bg-background flex flex-col gap-6 overflow-auto",
        className,
      )}
    >
      {/* Calendar Widget */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            className="px-2 h-8"
          >
            &lt;
          </Button>
          <h2 className="text-lg font-medium">
            {monthNames[viewMonth]} {viewYear}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="px-2 h-8"
          >
            &gt;
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
      </div>

      {/* Quick Links */}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium">Quick Links</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddLinkOpen(true)}
            className="h-8 px-2"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickLinks.map((link) => (
            <div
              key={link.id}
              className="aspect-square bg-background/50 rounded-md flex flex-col items-center justify-center relative group hover:bg-muted transition-colors cursor-pointer"
              onClick={() => openLink(link.url)}
            >
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuickLink(link.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {link.favicon ? (
                <img
                  src={link.favicon}
                  alt={link.title}
                  className="w-8 h-8 mb-1 rounded-sm object-contain"
                  onError={(e) => {
                    // If favicon fails to load, show a fallback icon
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='2' y1='12' x2='22' y2='12'%3E%3C/line%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <LinkIcon className="w-8 h-8 mb-1" />
              )}
              <span className="text-xs font-medium text-center px-1 truncate w-full">
                {link.title}
              </span>
              {/* External link icon removed for minimalism */}
            </div>
          ))}

          {quickLinks.length === 0 && (
            <div className="col-span-3 py-8 flex flex-col items-center justify-center text-muted-foreground">
              <LinkIcon className="h-8 w-8 mb-2" />
              <p className="text-sm">No quick links yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddLinkOpen(true)}
                className="mt-2 border-border/30"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add your first link
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent className="bg-background border border-border sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Quick Link</DialogTitle>
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
                className="col-span-3 border-border/30"
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
                className="col-span-3 border-border/30"
                placeholder="google.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddLinkOpen(false)}
              className="border-border/30"
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
