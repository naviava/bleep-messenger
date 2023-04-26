// React and Next.
import Link from "next/link";

// External packages.
import { Session } from "next-auth";

// Components.
import BleeperLogo from "@/components/logos/BleeperLogo";
import ChatList from "@/components/sidebar/ChatList";
import OverviewSection from "@/components/sidebar/OverviewSection";
import SidebarFriendRequests from "@/components/sidebar/SidebarFriendRequests";
import SidebarFooter from "@/components/sidebar/SidebarFooter";

interface SidebarPanelProps {
  session: Session;
  unseenFriendRequests: number;
  friends: User[];
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  session,
  unseenFriendRequests,
  friends,
}) => {
  return (
    <div className="mr-10 flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-800 px-6">
      {/* Logo */}
      <Link href="/dashboard" className="mt-4 flex h-16 shrink-0 items-center">
        <BleeperLogo
          horizontal
          height="h-8"
          logoClasses="-translate-y-[0.2rem]"
        />
      </Link>
      {/* Main panel. */}
      {friends.length > 0 ? (
        <div className="text-sm font-semibold leading-6 text-slate-500">
          Your chats
        </div>
      ) : null}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ChatList sessionId={session.user.id} friends={friends} />
          </li>
          <li>
            <OverviewSection />
          </li>
          <li>
            <SidebarFriendRequests
              sessionId={session.user.id}
              initialUnseenFriendRequests={unseenFriendRequests}
            />
          </li>
          <li className="-ml-6 mt-auto flex items-center gap-x-5">
            <SidebarFooter session={session} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarPanel;
