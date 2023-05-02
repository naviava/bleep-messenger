// React and Next.
import Image from "next/image";

interface ChatHeaderProps {
  chatPartner: User;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatPartner }) => {
  return (
    <div className="flex justify-between border-b-2 border-gray-400 py-3 sm:items-center">
      <div className="relative flex items-center space-x-4">
        <div className="relative">
          <div className="relative h-8 w-8 sm:h-12 sm:w-12">
            <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner.image}
              alt={`${chatPartner.name}`}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center text-xl">
            <span className="mr-3 font-semibold text-gray-300">
              {chatPartner.name}
            </span>
          </div>
          <span className="text-sm text-gray-500">{chatPartner.email}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
