"use client";

// React and Next.
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Lib and utils.
import { chatHrefConstructor } from "@/lib/utils";

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
            >
              {friend.name}
            </a>
          </div>
        );
      })}
    </ul>
  );
};

export default ChatList;
