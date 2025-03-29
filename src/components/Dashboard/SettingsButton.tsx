import React, { useState } from "react";
import { Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsButtonProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const SettingsButton = ({ darkMode, setDarkMode }: SettingsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    sound: false,
  });

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="bg-background">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="rounded-full w-10 h-10 border-border/40 bg-background/70 hover:bg-accent/70 backdrop-blur-sm"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-background border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center">
                {darkMode ? (
                  <Moon className="mr-2.5 h-4.5 w-4.5 text-primary" />
                ) : (
                  <Sun className="mr-2.5 h-4.5 w-4.5 text-primary" />
                )}
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-base">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Enable task reminders
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => toggleSetting("notifications")}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound" className="text-base">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds on actions
                </p>
              </div>
              <Switch
                id="sound"
                checked={settings.sound}
                onCheckedChange={() => toggleSetting("sound")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} className="bg-primary hover:bg-primary/90">
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsButton;
