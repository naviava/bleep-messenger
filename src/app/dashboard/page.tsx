// React and Next.
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// External packages.
import { ChevronRight } from "lucide-react";

// Lib and utils.
import getSession from "@/utils/getSession";
import { fetchRedis } from "@/utils/redis";
import { chatHrefConstructor } from "@/lib/utils";
import getFriendsByUserId from "@/utils/getFriendsByUserId";

const DashboardPage = async () => {
  const session = await getSession();
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendsChats = await Promise.all(
    friends.map(async (friend) => {
      const [latestMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      const latestMessage = JSON.parse(latestMessageRaw) as Message;

      return { ...friend, latestMessage };
    })
  );

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-5xl font-bold">Recent chats</h1>
      {friendsChats.length === 0 ? (
        <p className="text-sm text-gray-300">
          Nothing here. Start chatting with friends.
        </p>
      ) : (
        friendsChats.map((friend) => (
          <div
            key={friend.id}
            className="relative mb-4 rounded-md border-zinc-200 bg-slate-700 p-3"
          >
            <div className="absolute inset-y-0 right-4 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-100" />
            </div>
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-8 w-8 rounded-full bg-zinc-400">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name}'s profile photo`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1">
                  <div className="flex flex-row gap-x-1">
                    <span className="text-zinc-400">
                      {friend.latestMessage.senderId === session.user.id
                        ? "You: "
                        : ""}
                    </span>
                    <span className="max-w-md overflow-hidden overflow-ellipsis whitespace-nowrap text-zinc-200">
                      {friend.latestMessage.text}
                    </span>
                  </div>
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardPage;
