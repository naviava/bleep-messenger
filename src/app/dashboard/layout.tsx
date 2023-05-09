// React and Next.
import { ReactNode } from "react";
import { notFound } from "next/navigation";

// Components.
import SidebarPanel from "@/components/sidebar/SidebarPanel";

// Lib and utils.
import getSession from "@/utils/getSession";
import { fetchRedis } from "@/utils/redis";
import getFriendsByUserId from "@/utils/getFriendsByUserId";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getSession();
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

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
        friends={friends}
      />
      <aside className="container max-h-screen w-full py-16 md:py-12">
        {children}
      </aside>
    </div>
  );
};

export default DashboardLayout;
