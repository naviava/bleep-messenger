// React and Next.
import { memo } from "react";

// External packages.
import { Check, UserPlus, X } from "lucide-react";

interface FriendRequestItemProps {
  sessionId: string;
  request: IncomingFriendRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  sessionId,
  request,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="flex items-center gap-4">
      <UserPlus />
      <p className="text-lg font-medium">{request.senderEmail}</p>
      <button
        onClick={() => onAccept(request.senderId)}
        aria-label="Accept friend request"
        className="grid h-8 w-8 place-items-center rounded-full border-2 border-green-400 transition duration-300  hover:bg-gray-700 hover:shadow-md"
      >
        <Check className="h-3/4 w-3/4 font-semibold text-green-400" />
      </button>
      <button
        onClick={() => onDecline(request.senderId)}
        aria-label="Decline friend request"
        className="grid h-8 w-8 place-items-center rounded-full border-2 border-red-500 transition hover:bg-gray-700 hover:shadow-md"
      >
        <X className="h-3/4 w-3/4 font-semibold text-red-500" />
      </button>
    </div>
  );
};

export default memo(FriendRequestItem);
