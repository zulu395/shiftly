import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";
import { employeeRestrictedPaths, paths } from "@/utils/paths";
import { BsFillGridFill } from "react-icons/bs";
import {
  HiOutlinePresentationChartLine
} from "react-icons/hi";
import {
  HiOutlinePhone
} from "react-icons/hi2";
import {
  IoCalendarOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { LuHistory, LuCalendar1 } from "react-icons/lu";
import SidebarLinkItem, { SidebarLinkItemProps } from "./SidebarLinkItem";

export default async function SidebarLinks() {
  const account = await $getAccountFromSession();

  const isEmployee = !(account instanceof AppError) && account.role === "employee";

  const filteredLinks = isEmployee
    ? sidebarLinks.filter(link => !employeeRestrictedPaths.includes(link.href as typeof employeeRestrictedPaths[number]))
    : sidebarLinks;

  return (
    <div className="grid gap-1">
      {filteredLinks.map((link, idx) => (
        <SidebarLinkItem key={idx} {...link} />
      ))}
      {
        isEmployee && employeeOnlyLinks.map((link, idx) => (
          <SidebarLinkItem key={idx} {...link} />
        ))
      }
    </div>
  );
}

const employeeOnlyLinks: SidebarLinkItemProps[] = [
  {
    title: "Weekly Availability",
    href: paths.dashboardAvailability,
    icon: <LuCalendar1 />,
  },
];

const sidebarLinks: SidebarLinkItemProps[] = [
  {
    title: "Dashboard",
    href: paths.dashboard,
    icon: <BsFillGridFill />,
  },

  {
    title: "Staff Scheduling",
    href: paths.dashboardStaffScheduling,
    icon: <LuHistory />,
  },
  {
    title: "Event Planning",
    href: paths.dashboardEventPlanning,
    icon: <IoCalendarOutline />,
  },
  // {
  //   title: "Tasks",
  //   href: paths.dashboardTasks,
  //   icon: <HiOutlineClipboardDocumentList />,
  // },
  {
    title: "Messages",
    href: paths.dashboardMessages,
    icon: <IoChatbubbleEllipsesOutline />,
  },
  {
    title: "Analytics",
    href: paths.dashboardAnalytics,
    icon: <HiOutlinePresentationChartLine />,
  },
  {
    title: "Contacts Management",
    href: paths.dashboardContacts,
    icon: <HiOutlinePhone />,
  },
];
