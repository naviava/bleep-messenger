"use client";

// React and Next.
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// External packages.
import { toast } from "react-hot-toast";

// Components.
import ClientOnly from "../ClientOnly";
import UnseenChatToast from "../chatWindow/UnseenChatToast";

// Lib and utils.
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

interface ChatListProps {
  sessionId: string;
  friends: User[];
}

const ChatList: React.FC<ChatListProps> = ({ sessionId, friends }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      // If the message is from the current chat, don't notify.
      if (!shouldNotify) return;

      // If the message is from a different chat, notify.
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderName={message.senderName}
          senderMessage={message.text}
        />
      ));

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, router, sessionId]);

  useEffect(() => {
    if (pathname?.includes("chat"))
      setUnseenMessages((prev) =>
        prev.filter((message) => !pathname.includes(message.senderId))
      );
  }, [pathname]);

  return (
    <ClientOnly>
      <ul role="list" className="max-h-[25rem] space-y-1 overflow-y-auto">
        {friends.length > 0 ? (
          <div className="text-sm font-semibold leading-6 text-slate-500">
            Your chats
          </div>
        ) : null}
        {activeChats.sort().map((friend) => {
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
