import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import SignUpForm from "./SignUpForm";

interface SignUpButtonProps {
  text?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  isOpen?: boolean;
}

const SignUpButton = ({
  text = "Sign Up",
  variant = "outline",
  size = "default",
  showIcon = true,
  isOpen = false,
}: SignUpButtonProps) => {
  const [open, setOpen] = useState(isOpen);

  const handleSignUp = (values: any) => {
    console.log("Sign up successful with values:", values);
    // Here you would typically handle the sign-up process
    // For example, sending the data to an API
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className="border-none bg-background/50 text-foreground hover:bg-muted rounded-full"
      >
        {showIcon && <UserPlus className="mr-2 h-4 w-4" />}
        {text}
      </Button>

      <SignUpForm open={open} onOpenChange={setOpen} onSubmit={handleSignUp} />
    </>
  );
};

export default SignUpButton;
