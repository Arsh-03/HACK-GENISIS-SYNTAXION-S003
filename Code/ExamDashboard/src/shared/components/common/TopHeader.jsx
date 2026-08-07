import React from 'react';
import { Bell, Search, HelpCircle, LogOut, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function TopHeader({ title = "Nexis Enterprise CBT Platform" }) {
  const { user, selectedRole, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 left-[280px] h-16 z-30 flex justify-between items-center px-6 bg-surface-bright border-b border-outline-variant">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-on-surface">{title}</h1>
        {selectedRole && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
            {selectedRole}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high" title="Search">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-md hover:bg-surface-container-high relative" title="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
        </div>

        <div className="h-4 w-px bg-outline-variant mx-1"></div>

        <Button variant="outline" size="sm" icon={UserCheck} onClick={() => navigate('/')}>
          Switch Portal
        </Button>

        <Button variant="ghost" size="sm" icon={LogOut} onClick={logout} className="text-red-600 hover:bg-red-50">
          Sign Out
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center">
            {user?.avatar || 'AD'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-on-surface">{user?.name || 'Admin Proctor'}</div>
            <div className="text-[10px] text-on-surface-variant">{user?.email || 'proctor@nexiscbt.com'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
