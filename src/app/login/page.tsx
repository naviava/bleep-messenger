// Components.
import ClientOnly from "@/components/ClientOnly";
import LoginClient from "./LoginClient";

const LoginPage = () => {
  return (
    <ClientOnly>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <LoginClient />
      </div>
    </ClientOnly>
  );
};

export default LoginPage;
