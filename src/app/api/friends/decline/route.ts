import { z } from "zod";

import { db } from "@/lib/db";
import getSession from "@/utils/getSession";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id: idToDecline } = z.object({ id: z.string() }).parse(body);

    await db.srem(
      `user:${session.user.id}:incoming_friend_requests`,
      idToDecline
    );

    return new Response("OK");
  } catch (err) {
    throw err;
  }
}
