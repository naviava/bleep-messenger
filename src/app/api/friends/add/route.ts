// External packages.
import { z } from "zod";

// Lib and utils.
import { addFriendValidator } from "@/lib/validations/addFriend";
import { fetchRedis } from "@/utils/redis";
import { db } from "@/lib/db";
import getSession from "@/utils/getSession";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    if (idToAdd === session.user.id)
      return new Response("Cannot add yourself.", { status: 400 });

    // Check if user is already added.
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    if (!!isAlreadyAdded)
      return new Response("Already added.", { status: 400 });

    // Check if user is already a friend.
    const isFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    if (!!isFriend) return new Response("Already a friend.", { status: 400 });

    // All validity checks done, send friend request.
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      { senderId: session.user.id, senderEmail: session.user.email }
    );

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response("Friend request sent.", { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError)
      return new Response("Invalid request payload", { status: 422 });

    return new Response("Invalid request", { status: 400 });
  }
}
