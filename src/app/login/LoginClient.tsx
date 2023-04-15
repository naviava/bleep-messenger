"use client";

// React and Next.
import { useCallback, useState } from "react";

// External packages.
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

// Components.
import BleeperLogo from "@/components/logos/BleeperLogo";
import Button from "@/components/ui/Button";
import GoogleLogo from "@/components/logos/GoogleLogo";

interface LoginClientProps {}

const LoginClient: React.FC<LoginClientProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useCallback(() => {
    setIsLoading(true);
    signIn("google")
      .then(() => toast.success("Successfully logged in."))
      .catch(() => toast.error("Error logging in with Google."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-8">
      <div className="flex flex-col items-center gap-8">
        <BleeperLogo />
        <h2 className="text-center text-3xl font-bold tracking-normal text-gray-800">
          Sign in to your account
        </h2>
      </div>
      <Button
        type="button"
        onClick={handleGoogleLogin}
        isLoading={isLoading}
        className="mx-auto w-full max-w-sm"
      >
        {isLoading ? null : <GoogleLogo />}
        Google
      </Button>
    </div>
  );
};

export default LoginClient;
