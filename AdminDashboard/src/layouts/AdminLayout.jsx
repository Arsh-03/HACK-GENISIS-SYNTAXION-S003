import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarNav } from '../shared/components/common/SidebarNav';
import { TopHeader } from '../shared/components/common/TopHeader';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col pl-[280px]">
        {/* Top Header */}
        <TopHeader />

        {/* Page Outlet */}
        <main className="flex-1 mt-16 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
