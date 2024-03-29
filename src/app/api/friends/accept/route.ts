import { z } from "zod";

import { db } from "@/lib/db";
import getSession from "@/utils/getSession";
import { fetchRedis } from "@/utils/redis";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    // Verify both users are not already friends.
    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );
    if (!!isAlreadyFriend)
      return new Response("Already friends", { status: 400 });

    // Verify the user has a pending friend request.
    const hasPendingRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    );
    if (!hasPendingRequest)
      return new Response("No pending request", { status: 400 });

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;

    // Add both users to each other's friend lists.
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        "new_friend",
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        "new_friend",
        friend
      ),
      db.sadd(`user:${session.user.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, session.user.id),
      // Remove the pending friend request.
      db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd),
      // Functionality to show outgoing friend requests is not implemented yet.
      // await db.srem(`user:${idToAdd}:outbound_friend_requests`, session.user.id),
    ]);

    return new Response("OK");
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid request payload", { status: 422 });

    return new Response("Invalid request", { status: 400 });
  }
}
