"use client";

// React and Next.
import { ButtonHTMLAttributes, useCallback, useState } from "react";

// External packages.
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

// Components.
import ClientOnly from "../ClientOnly";
import Button from "./Button";
import { Loader2, LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: React.FC<SignOutButtonProps> = ({ ...props }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutHandler = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err: any) {
      toast.error("Couldn't log out");
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  return (
    <ClientOnly>
      <Button {...props} onClick={logoutHandler}>
        {!!isLoggingOut && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoggingOut && <LogOut className="h-4 w-4" />}
      </Button>
    </ClientOnly>
  );
};

export default SignOutButton;
