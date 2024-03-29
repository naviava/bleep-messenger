"use client";

// React and Next.
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// External packages.
import { Session } from "next-auth";
import { Dialog, Transition } from "@headlessui/react";
import { Menu, X } from "lucide-react";

// Components.
import Button, { buttonVariants } from "./ui/Button";
import BleeperLogo from "./logos/BleeperLogo";
import ChatList from "./sidebar/ChatList";
import OverviewSection from "./sidebar/OverviewSection";
import SidebarFriendRequests from "./sidebar/SidebarFriendRequests";
import SidebarFooter from "./sidebar/SidebarFooter";

interface MobileChatLayoutProps {
  session: Session;
  unseenFriendRequests: number;
  friends: User[];
}

const MobileChatLayout: React.FC<MobileChatLayoutProps> = ({
  session,
  unseenFriendRequests,
  friends,
}) => {
  const [open, setOpen] = useState(true);

  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="fixed inset-x-0 top-0 border-b border-zinc-200 bg-slate-800 px-4 py-2">
      <div className="flex w-full items-center justify-between">
        <Link href="/dashboard">
          <BleeperLogo iconOnly logoClasses="h-10 w-10" />
        </Link>
        <Button onClick={() => setOpen(true)} className="gap-4">
          Menu <Menu className="h-6 w-6" />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-slate-800 py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-300">
                          Dashboard
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-10 flex-1 px-4 sm:px-6">
                        {/* Main panel. */}
                        {friends.length > 0 ? (
                          <div className="text-sm font-semibold leading-6 text-slate-500">
                            Your chats
                          </div>
                        ) : null}
                        <nav className="flex flex-1 flex-col">
                          <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                          >
                            <li>
                              <ChatList
                                sessionId={session.user.id}
                                friends={friends}
                              />
                            </li>
                            <li>
                              <OverviewSection />
                            </li>
                            <li>
                              <SidebarFriendRequests
                                sessionId={session.user.id}
                                initialUnseenFriendRequests={
                                  unseenFriendRequests
                                }
                              />
                            </li>
                            <li className="-ml-6 mt-auto flex items-center gap-x-5">
                              <SidebarFooter session={session} />
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default MobileChatLayout;
