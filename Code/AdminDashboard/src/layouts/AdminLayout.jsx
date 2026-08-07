import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarNav } from '../shared/components/common/SidebarNav';
import { TopHeader } from '../shared/components/common/TopHeader';

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Sidebar Navigation */}
      <SidebarNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Shell */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'pl-[70px]' : 'pl-[280px]'}`}>
        {/* Top Header */}
        <TopHeader isCollapsed={isCollapsed} />

        {/* Page Outlet */}
        <main className="flex-1 mt-16 p-8 overflow-y-auto overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
