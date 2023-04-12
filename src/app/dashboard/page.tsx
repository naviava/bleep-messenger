"use client";
// Components.
import ClientOnly from "@/components/ClientOnly";
import { signOut } from "next-auth/react";

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = ({}) => {
  return (
    <>
      <ClientOnly>
        <div>Dashboard</div>
      </ClientOnly>
      <div onClick={() => signOut({ callbackUrl: "/login" })}>Logout</div>
    </>
  );
};

export default DashboardPage;
