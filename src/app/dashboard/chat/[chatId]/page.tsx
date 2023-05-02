// React and Next.
import { notFound } from "next/navigation";
import Image from "next/image";

// Components.
import ChatHeader from "@/components/chatWindow/ChatHeader";
import ChatMessages from "@/components/chatWindow/ChatMessages";

// Lib and utils.
import { db } from "@/lib/db";
import getSession from "@/utils/getSession";
import getChatMessages from "@/lib/getChat";
import ChatInput from "@/components/chatWindow/ChatInput";

interface ChatPageProps {
  params: {
    chatId: string;
  };
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const { chatId } = params;

  const session = await getSession();
  if (!session) notFound();
  const { user } = session;

  // Split the chatId to get the user ids.
  const [userId1, userId2] = chatId.split("--");

  // If the user is not part of the chat, redirect to 404.
  if (userId1 !== user.id && userId2 !== user.id) notFound();

  const chatPartnerId = userId1 === user.id ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialChatMessages = await getChatMessages(chatId);

  return (
    <div className="flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between">
      <ChatHeader chatPartner={chatPartner} />
      <ChatMessages
        sessionId={session.user.id}
        initialMessages={initialChatMessages}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};
export default ChatPage;
