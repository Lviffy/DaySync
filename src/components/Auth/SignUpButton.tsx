import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

const SignUpButton = ({
  text = "Sign Up",
  variant = "outline",
  size = "default",
  showIcon = true,
}: SignUpButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className="border-none bg-background/50 text-foreground hover:bg-muted rounded-full"
    >
      {showIcon && <UserPlus className="mr-2 h-4 w-4" />}
      {text}
    </Button>
  );
};

export default SignUpButton;
