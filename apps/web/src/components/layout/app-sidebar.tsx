"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Office Check-In", href: "/office-check-ins" },
  { label: "Contacts", href: "/contacts" },
  { label: "Students", href: "/students" },
  { label: "Applications", href: "/applications" },
  { label: "Documents", href: "/documents" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AppSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ open = true, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen overflow-hidden border-r border-gray-200 bg-white transition-all duration-200 md:relative md:z-auto md:h-auto md:min-h-screen",
          // Mobile: slide in/out
          open
            ? "w-64 translate-x-0 md:w-64 md:translate-x-0"
            : "w-64 -translate-x-full md:w-0 md:translate-x-0 md:border-r-0 md:pointer-events-none",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Consultancy</h2>
              <p className="text-xs text-gray-500">CRM</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-4 text-xs text-gray-500">
            <p>© 2026 Consultancy App</p>
          </div>
        </div>
      </aside>
    </>
  );
}
