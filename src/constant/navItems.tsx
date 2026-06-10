import { HomeIcon, ParagraphIcon, ResumeIcon, BudgetIcon, SettingIcon } from "../assets/SVG/Sidebar_icon";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { href: "/home",        label: "Home",        icon: <HomeIcon /> },
  { href: "/paragraph",   label: "Paragraph",   icon: <ParagraphIcon /> },
  { href: "/resume",      label: "Resume",      icon: <ResumeIcon /> },
  { href: "/budget",      label: "Budget",      icon: <BudgetIcon /> },
  { href: "/setting",  label: "Setting",  icon: <SettingIcon /> },
];