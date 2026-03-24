"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Sidebar - visible on desktop, drawer on mobile */}
      <AppSidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        {/* Topbar */}
        <AppTopbar sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />

        {/* Main area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
