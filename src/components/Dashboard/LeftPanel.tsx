import React, { useState, useEffect } from "react";
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
import { PlusCircle, Link as LinkIcon, ExternalLink, X, Loader2 } from "lucide-react";
import { useUser } from "../../contexts/UserContext.jsx";
import { quickLinkService } from "../../services/quickLinkService";
import { useToast, Toast } from "../ui/toast";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  user_id?: string;
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
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [showToast, setShowToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ visible: false, message: '', type: 'info' });

  // Fetch quick links when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchQuickLinks();
    }
  }, [user]);

  // Fetch quick links from Supabase
  const fetchQuickLinks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const links = await quickLinkService.fetchQuickLinks(user.id);
      setQuickLinks(links);
    } catch (error) {
      console.error("Error fetching quick links:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Get favicon URL from domain
  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      // If URL parsing fails, try with added protocol
      try {
        const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
        const domain = new URL(urlWithProtocol).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      } catch {
        // Default favicon if all else fails
        return 'https://www.google.com/s2/favicons?domain=example.com&sz=64';
      }
    }
  };

  // Add new quick link
  const addQuickLink = async () => {
    if (!user || !newLink.title || !newLink.url) {
      console.log("Cannot add link: missing user, title, or URL", { 
        hasUser: !!user, 
        title: newLink.title, 
        url: newLink.url 
      });
      setShowToast({
        visible: true,
        message: "Please enter both title and URL",
        type: "error"
      });
      return;
    }

    try {
      setLoading(true);
      console.log("About to add quick link with user ID:", user.id);
      console.log("Link data:", newLink);
      
      const link = await quickLinkService.addQuickLink(newLink, user.id);
      console.log("Link added successfully:", link);
      
      setQuickLinks([...quickLinks, link]);
      setNewLink({ title: "", url: "" });
      setIsAddLinkOpen(false);
      setShowToast({
        visible: true,
        message: "Quick link added successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error adding quick link:", error);
      // Get more specific error message
      let errorMessage = "Failed to add link. Please try again.";
      
      if (error instanceof Error) {
        console.error("Detailed error:", error.message);
        
        if (error.message.includes("table") && error.message.includes("exist")) {
          errorMessage = "Quick links table doesn't exist in the database. Please check Supabase setup.";
        } else if (error.message.includes("foreign key constraint")) {
          errorMessage = "User authentication issue. Please try signing out and in again.";
        } else if (error.message.includes("permission denied")) {
          errorMessage = "Permission denied. Please check RLS policies in Supabase.";
        }
      }
      
      setShowToast({
        visible: true,
        message: errorMessage,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove quick link
  const removeQuickLink = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await quickLinkService.deleteQuickLink(id);
      setQuickLinks(quickLinks.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error removing quick link:", error);
    } finally {
      setLoading(false);
    }
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
      {/* Toast notification */}
      {showToast.visible && (
        <Toast 
          message={showToast.message}
          type={showToast.type}
          duration={3000}
          onClose={() => setShowToast({ ...showToast, visible: false })}
        />
      )}

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
          <h2 className="text-base md:text-lg font-medium text-foreground/90">Favorites</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddLinkOpen(true)}
            className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
            disabled={!user || loading}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="h-3.5 w-3.5 mr-1.5" />} 
            {loading ? "" : "Add"}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {loading && quickLinks.length === 0 ? (
            <div className="col-span-3 flex justify-center items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading links...</span>
            </div>
          ) : quickLinks.length === 0 ? (
            <div className="col-span-3 text-center py-4 text-sm text-muted-foreground">
              {user ? "No quick links yet. Add some!" : "Sign in to add quick links"}
            </div>
          ) : (
            quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-md bg-background/60 hover:bg-primary/5 border border-border/30 transition-all duration-200 group relative"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1 text-primary group-hover:bg-primary/20 transition-colors">
                  {link.favicon ? (
                    <img 
                      src={link.favicon} 
                      alt={link.title} 
                      className="w-5 h-5 rounded-full object-contain" 
                      onError={(e) => {
                        e.currentTarget.src = ""; 
                        e.currentTarget.onerror = null;
                        e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                      }}
                    />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs font-medium text-center line-clamp-1">{link.title}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeQuickLink(link.id);
                  }}
                  className="absolute top-0 right-0 w-5 h-5 rounded-full bg-background/80 text-foreground/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  disabled={loading}
                >
                  <X className="h-3 w-3" />
                </button>
              </a>
            ))
          )}
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={addQuickLink}
              disabled={!newLink.title || !newLink.url || loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {loading ? "Adding..." : "Add Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeftPanel;
