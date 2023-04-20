// React and Next.
import { notFound } from "next/navigation";

// Components.
import FriendRequestsClient from "./FriendRequestsClient";

// Lib and utils.
import getSession from "@/utils/getSession";
import { fetchRedis } from "@/utils/redis";

const FriendRequestsPage = async () => {
  const session = await getSession();
  if (!session) notFound();

  const incomingFriendIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingFriendIds.map(async (senderId) => {
      const rawSenderData = (await fetchRedis(
        "get",
        `user:${senderId}`
      )) as string;
      const sender = JSON.parse(rawSenderData);
      return {
        senderId,
        senderEmail: sender.email,
      };
    })
  );

  return (
    <main className="w-full pr-5 pt-8">
      <FriendRequestsClient
        sessionId={session.user.id}
        incomingFriendRequests={incomingFriendRequests}
      />
    </main>
  );
};
export default FriendRequestsPage;
