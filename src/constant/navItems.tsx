import { HomeIcon, ProductIcon, OrderIcon, TrackingIcon, SettingIcon } from "../assets/SVG/Sidebar_icon";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { href: "/home",     label: "Home",     icon: <HomeIcon /> },
  { href: "/product",  label: "Product",  icon: <ProductIcon /> },
  { href: "/order",    label: "Order",    icon: <OrderIcon /> },
  { href: "/tracking", label: "Tracking", icon: <TrackingIcon /> },
  { href: "/setting",  label: "Setting",  icon: <SettingIcon /> },
];