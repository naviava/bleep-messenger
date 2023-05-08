"use client";

// React and Next.
import { useEffect, useState } from "react";
import Link from "next/link";

// External packages.
import { Users } from "lucide-react";
import ClientOnly from "../ClientOnly";

// Lib and utils.
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface SidebarFriendRequestsProps {
  sessionId: string;
  initialUnseenFriendRequests: number;
}

const SidebarFriendRequests: React.FC<SidebarFriendRequestsProps> = ({
  sessionId,
  initialUnseenFriendRequests,
}) => {
  const [unseenFriendRequests, setUnseenFriendRequests] = useState(
    initialUnseenFriendRequests
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = () => {
      setUnseenFriendRequests((prev) => prev + 1);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    // Cleanups.
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <ClientOnly>
      <Link
        href="/dashboard/requests"
        className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-300 transition hover:bg-gray-700 hover:text-primary-1"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium text-gray-400 group-hover:text-primary-1">
          <Users className="h-6 w-6" />
        </div>
        <p>Friend requests</p>
        {!!unseenFriendRequests && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-1 text-xs text-gray-800">
            {unseenFriendRequests}
          </div>
        )}
      </Link>
    </ClientOnly>
  );
};

export default SidebarFriendRequests;
