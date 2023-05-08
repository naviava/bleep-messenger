"use client";

// React and Next.
import { useEffect, useRef, useState } from "react";

// External packages.
import { format } from "date-fns";

// Components.
import ClientOnly from "../ClientOnly";

// Lib and utils.
import { Message } from "@/lib/validations/message";
import { cn, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface ChatMessagesProps {
  sessionId: string;
  chatId: string;
  initialMessages: Message[];
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  sessionId,
  chatId,
  initialMessages,
  sessionImg,
  chatPartner,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming_message", messageHandler);

    // Cleanups.
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", messageHandler);
    };
  }, [chatId]);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <ClientOnly>
      <div
        id="messages"
        className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3"
      >
        <div ref={scrollDownRef} />
        {messages.map((message, idx) => {
          const isCurrentUser = message.senderId === sessionId;
          const hasNextMessageFromSameUser =
            messages[idx - 1]?.senderId === messages[idx].senderId;
          return (
            <div
              key={`${message.id}-${message.timestamp}`}
              className="chat-message"
            >
              <div
                className={cn("flex items-end", {
                  "justify-end": isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    "mx-2 flex max-w-xs flex-col space-y-2 text-base",
                    {
                      "order-1 items-end": isCurrentUser,
                      "order-2 items-start": !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn("inline-block rounded-lg px-4 py-2", {
                      "bg-indigo-600 text-white": isCurrentUser,
                      "bg-gray-200 text-gray-900": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {message.text}{" "}
                    <span className="ml-2 text-xs text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </span>
                </div>
                <div
                  className={cn("relative h-6 w-6", {
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <Image
                    fill
                    src={
                      isCurrentUser ? (sessionImg as string) : chatPartner.image
                    }
                    alt="Profile picture"
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ClientOnly>
  );
};

export default ChatMessages;
