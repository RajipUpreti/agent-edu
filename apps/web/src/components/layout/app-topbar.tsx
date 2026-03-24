"use client";

import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

interface AppTopbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function AppTopbar({ sidebarOpen, onSidebarToggle }: AppTopbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onSidebarToggle}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop sidebar collapse button */}
          <button
            onClick={onSidebarToggle}
            className="hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:flex"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-gray-900">Consultancy CRM</h1>
          </div>
        </div>

        {/* Right side - could add user menu, notifications, etc. */}
        <div />
      </div>
    </div>
  );
}
