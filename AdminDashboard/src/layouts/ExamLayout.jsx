import React from 'react';
import { Outlet } from 'react-router-dom';

export function ExamLayout() {
  return (
    <div className="h-screen w-screen bg-background text-on-surface flex flex-col font-sans select-none overflow-hidden">
      <Outlet />
    </div>
  );
}
