// React and Next.
import Link from "next/link";

// External packages.
import { LucideIcon, UserPlus } from "lucide-react";

interface OverviewSectionProps {}

interface SideOption {
  id: number;
  name: string;
  href: string;
  Icon: LucideIcon;
}

const sidebarOptions: SideOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/addfriend",
    Icon: UserPlus,
  },
];

const OverviewSection: React.FC<OverviewSectionProps> = ({}) => {
  return (
    <>
      <div className="text-sm font-semibold leading-6 text-slate-500">
        Overview
      </div>
      <ul role="list" className="mt-2 space-y-1">
        {sidebarOptions.map((option) => {
          const Icon = option.Icon;
          return (
            <li key={option.id}>
              <Link
                href={option.href}
                className="hover group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 transition hover:bg-gray-700 hover:text-primary-1"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium text-gray-400 transition group-hover:text-primary-1">
                  <Icon />
                </span>
                <span className="truncate">{option.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default OverviewSection;
