"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/inventory", icon: "inventory_2", label: "Inventory" },
  { href: "/leads", icon: "group", label: "Leads" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function DealerAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#101622] min-h-screen max-w-lg mx-auto relative pb-24">
      {children}

      <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-[#101622]/95 ios-blur border-t border-white/10 px-6 py-3 flex justify-between items-center">
        {NAV_ITEMS.slice(0, 2).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-slate-400"}`}>
              <MaterialIcon name={item.icon} fill={active} className="text-[24px]" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}

        <div className="relative -mt-10">
          <Link
            href="/studio"
            className="w-14 h-14 bg-primary rounded-full text-white shadow-xl shadow-primary/30 flex items-center justify-center border-4 border-[#101622] active:scale-90 transition-transform"
          >
            <MaterialIcon name="add" className="text-[28px]" />
          </Link>
        </div>

        {NAV_ITEMS.slice(2).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-slate-400"}`}>
              <MaterialIcon name={item.icon} fill={active} className="text-[24px]" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
