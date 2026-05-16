"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";

type SubItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: SubItem[];
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV: NavGroup[] = [
  {
    group: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        label: "Orders",
        href: "/orders",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
      {
        label: "Products",
        href: "/products",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        children: [
          { label: "All Products", href: "/products" },
          { label: "Add Product",  href: "/products/add" },
        ],
      },
      {
        label: "Customers",
        href: "/customers",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Repair",
    items: [
      {
        label: "Repair",
        href: "/repair/booking",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        children: [
          { label: "Repair Appointment", href: "/repair/booking" },
          { label: "Applications",    href: "/repair/applications" },
        ],
      },
    ],
  },
  {
    group: "Store",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAdminStore();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function isGroupActive(item: NavItem) {
    if (isActive(item.href)) return true;
    return item.children?.some((c) => isActive(c.href)) ?? false;
  }

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col bg-slate-900 transition-all duration-300
          ${sidebarCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0 ${sidebarCollapsed ? "lg:justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: "18px", height: "18px" }} className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-white font-bold text-sm leading-none">Jesup</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV.map((group) => (
            <div key={group.group} className="mb-6">
              {!sidebarCollapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
                  {group.group}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active    = isActive(item.href);
                  const grpActive = isGroupActive(item);
                  const hasChildren = !!item.children?.length;
                  const showChildren = hasChildren && !sidebarCollapsed && grpActive;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                          ${sidebarCollapsed ? "lg:justify-center" : ""}
                          ${active
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : grpActive
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:text-white hover:bg-slate-800"
                          }
                        `}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {!sidebarCollapsed && <span className="flex-1">{item.label}</span>}
                        {!sidebarCollapsed && hasChildren && (
                          <svg
                            className={`w-3.5 h-3.5 transition-transform ${grpActive ? "rotate-90" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>

                      {/* Sub-items */}
                      {showChildren && (
                        <ul className="mt-0.5 ml-3 pl-3 border-l border-slate-700 space-y-0.5">
                          {item.children!.map((child) => {
                            const childActive = isActive(child.href);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`
                                    flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                                    ${childActive
                                      ? "bg-primary/20 text-primary"
                                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }
                                  `}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${childActive ? "bg-primary" : "bg-slate-600"}`} />
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom user info */}
        <div className={`px-3 pb-4 border-t border-slate-800 pt-4 ${sidebarCollapsed ? "lg:px-2" : ""}`}>
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? "lg:justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              JA
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">Jesup Admin</p>
                <p className="text-slate-400 text-[11px] truncate">admin@jesup.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
