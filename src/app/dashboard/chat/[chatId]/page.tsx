// React and Next.
import { notFound } from "next/navigation";

// Lib and utils.
import { db } from "@/lib/db";
import getSession from "@/utils/getSession";
import getChatMessages from "@/lib/getChat";

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

  return <div>{chatId}</div>;
};
export default ChatPage;
