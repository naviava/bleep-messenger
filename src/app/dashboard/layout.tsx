// React and Next.
import { ReactNode } from "react";
import { notFound } from "next/navigation";

// Components.
import SidebarPanel from "@/components/sidebar/SidebarPanel";

// Lib and utils.
import getSession from "@/utils/getSession";
import { fetchRedis } from "@/utils/redis";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getSession();
  if (!session) notFound();

  const unseenFriendRequests = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    // Main sidebar container.
    <div className="flex h-screen w-full">
      <SidebarPanel
        session={session}
        unseenFriendRequests={unseenFriendRequests}
      />
      {children}
    </div>
  );
};

export default DashboardLayout;
