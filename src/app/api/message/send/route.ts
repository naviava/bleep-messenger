import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import getSession from "@/utils/getSession";
import { fetchRedis } from "@/utils/redis";
import { messageValidator } from "@/lib/validations/message";
import { Message } from "@/lib/validations/message";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getSession();

    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");
    if (userId1 !== session.user.id && userId2 !== session.user.id)
      return new Response("Unauthorized", { status: 401 });

    const friendId = session.user.id === userId1 ? userId2 : userId1;
    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);
    if (!isFriend) return new Response("Unauthorized", { status: 401 });

    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    // All validity checks passed, send message.
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    // Notify all connected clients.
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming_message",
      message
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    if (err instanceof Error) return new Response(err.message, { status: 500 });
    return new Response("Internal Server Error", { status: 500 });
  }
}
