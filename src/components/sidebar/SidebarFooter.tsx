// React and Next.
import Image from "next/image";

// Components.
import SignOutButton from "@/components/ui/SignOutButton";
import { Session } from "next-auth";

interface SidebarFooterProps {
  session: Session;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ session }) => {
  return (
    <>
      <div className="flex flex-1 items-center gap-x-4 py-3 pl-2 text-sm font-semibold leading-6 text-slate-400">
        <div className="full relative h-9 w-9 rounded-full bg-gray-600">
          <Image
            src={session.user.image || ""}
            alt="User profile photo"
            fill
            referrerPolicy="no-referrer"
            className="rounded-full"
          />
        </div>
        <span className="sr-only">Your profile</span>
        <div className="flex flex-col">
          <span aria-hidden="true">{session.user.name}</span>
          <span className="text-xs text-zinc-500" aria-hidden={true}>
            {session.user.email}
          </span>
        </div>
      </div>
      <SignOutButton />
    </>
  );
};

export default SidebarFooter;
