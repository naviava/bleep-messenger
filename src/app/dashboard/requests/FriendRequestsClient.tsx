"use client";

// React and Next.
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// External packages.
import axios from "axios";

// Components.
import FriendRequestItem from "@/components/friendRequests/FriendRequestItem";

interface FriendRequestsClientProps {
  sessionId: string;
  incomingFriendRequests: IncomingFriendRequest[];
}

const FriendRequestsClient: React.FC<FriendRequestsClientProps> = ({
  sessionId,
  incomingFriendRequests,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);

  const onAcceptFriendRequest = useCallback(
    async (senderId: string) => {
      await axios.post("/api/friends/accept", { id: senderId });

      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
    },
    [router]
  );

  const onDeclineFriendRequest = useCallback(
    async (senderId: string) => {
      await axios.post("/api/friends/decline", { id: senderId });

      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );

      router.refresh();
    },
    [router]
  );

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold text-slate-400">
        Incoming friend requests
      </h1>
      {friendRequests.length === 0 ? (
        // TODO: Add a nice illustration here. Maybe a little robot? Or a little alien?
        <div className="mt-5 flex p-5 text-sm text-gray-300">
          Nothing here right now. Check back again, later.
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-4 p-5">
          {friendRequests.map((request) => (
            <FriendRequestItem
              key={request.senderId}
              sessionId={sessionId}
              request={request}
              onAccept={onAcceptFriendRequest}
              onDecline={onDeclineFriendRequest}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FriendRequestsClient;
