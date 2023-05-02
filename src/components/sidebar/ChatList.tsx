"use client";

// React and Next.
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Lib and utils.
import { chatHrefConstructor } from "@/lib/utils";
import ClientOnly from "../ClientOnly";

interface ChatListProps {
  sessionId: string;
  friends: User[];
}

const ChatList: React.FC<ChatListProps> = ({ sessionId, friends }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathname?.includes("chat"))
      setUnseenMessages((prev) =>
        prev.filter((message) => !pathname.includes(message.senderId))
      );
  }, [pathname]);

  return (
    <ClientOnly>
      <ul role="list" className="max-h-[25rem] space-y-1 overflow-y-auto">
        {friends.sort().map((friend) => {
          const unseenMessageCount = unseenMessages.filter(
            (unseenMsg) => unseenMsg.senderId === friend.id
          ).length;
          return (
            <div key={friend.id}>
              <a
                href={`/dashboard/chat/${chatHrefConstructor(
                  sessionId,
                  friend.id
                )}`}
                className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-300 transition hover:bg-gray-700 hover:text-primary-1"
              >
                {friend.name}
                {unseenMessageCount > 0 ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-1 text-xs font-medium text-gray-800">
                    {unseenMessageCount}
                  </div>
                ) : null}
              </a>
            </div>
          );
        })}
      </ul>
    </ClientOnly>
  );
};

export default ChatList;
