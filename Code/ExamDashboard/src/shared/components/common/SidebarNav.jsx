import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Sparkles,
  ShieldAlert,
  BarChart3,
  SlidersHorizontal,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Activity,
  Lock,
  FileCheck,
  Palette,
  HelpCircle,
  FileSpreadsheet,
  UserCheck,
  Calendar,
  Layers,
  Grid,
  Bot,
  AlertTriangle,
  Award,
  Shield,
  Clock,
  UserCog,
  Settings,
  FileText
} from 'lucide-react';

export function SidebarNav() {
  const location = useLocation();

  // Navigation sections taxonomy
  const navSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      singleRoute: true
    },
    {
      id: 'candidate-mgmt',
      label: 'Candidate Management',
      icon: Users,
      items: [
        { label: 'Students', path: '/admin/candidates/students', icon: Users },
        { label: 'Identity Verification', path: '/admin/candidates/verification', icon: UserCheck },
        { label: 'Bulk Import', path: '/admin/candidates/import', icon: FileSpreadsheet }
      ]
    },
    {
      id: 'examination',
      label: 'Examination',
      icon: BookOpen,
      items: [
        { label: 'Sessions', path: '/admin/examination/sessions', icon: Calendar },
        { label: 'Question Bank', path: '/admin/examination/question-bank', icon: Layers },
        { label: 'Exam Builder', path: '/admin/examination/builder', icon: FileText },
        { label: 'Seat Mapping', path: '/admin/examination/seat-mapping', icon: Grid }
      ]
    },
    {
      id: 'ai',
      label: 'AI Capabilities',
      icon: Sparkles,
      items: [
        { label: 'AI Paper Generation', path: '/admin/ai/generation', icon: Bot },
        { label: 'AI Pipeline', path: '/admin/ai/pipeline', icon: Sparkles, badge: 'ACTIVE' },
        { label: 'AI Audit', path: '/admin/ai/audit', icon: Shield }
      ]
    },
    {
      id: 'proctoring',
      label: 'Proctoring',
      icon: ShieldAlert,
      items: [
        { label: 'Live Monitoring', path: '/admin/proctoring/live', icon: ShieldAlert, badge: 'LIVE' },
        { label: 'Incidents', path: '/admin/proctoring/incidents', icon: AlertTriangle }
      ]
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      items: [
        { label: 'Dashboard', path: '/admin/reports/dashboard', icon: BarChart3 },
        { label: 'Attendance', path: '/admin/reports/attendance', icon: Clock },
        { label: 'Performance', path: '/admin/reports/performance', icon: Award },
        { label: 'Violations', path: '/admin/reports/violations', icon: AlertTriangle }
      ]
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: SlidersHorizontal,
      items: [
        { label: 'User Management', path: '/admin/administration/users', icon: UserCog },
        { label: 'Roles & Permissions', path: '/admin/administration/roles', icon: Shield },
        { label: 'Settings', path: '/admin/administration/settings', icon: Settings },
        { label: 'Audit Logs', path: '/admin/administration/logs', icon: FileText }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: Bell,
      items: [
        { label: 'Notifications', path: '/admin/system/notifications', icon: Bell },
        { label: 'Help & Docs', path: '/admin/system/help', icon: HelpCircle }
      ]
    }
  ];

  // Utility links
  const secondaryLinks = [
    { label: 'Administrator Login', path: '/admin/login', icon: Lock },
    { label: 'Examination Portal', path: '/exam/login', icon: FileCheck },
    { label: 'Design System', path: '/admin/design-system', icon: Palette }
  ];

  // Accordion state
  const [openSections, setOpenSections] = useState({});

  // Auto expand section if current location matches any of its sub-items
  useEffect(() => {
    const newOpen = { ...openSections };
    navSections.forEach(sec => {
      if (sec.items && sec.items.some(item => location.pathname === item.path || location.pathname.startsWith(item.path))) {
        newOpen[sec.id] = true;
      }
    });
    setOpenSections(newOpen);
  }, [location.pathname]);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <aside className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-surface border-r border-outline-variant w-[280px] py-5 select-none">
      {/* Brand Header */}
      <div className="px-6 pb-4 border-b border-outline-variant shrink-0">
        <NavLink to="/admin/dashboard" className="text-xl font-black text-primary flex items-center gap-2">
          <Activity className="w-7 h-7 text-primary" />
          <span className="tracking-tight text-on-surface">CBT Platform</span>
        </NavLink>
        <div className="text-on-surface-variant text-[11px] mt-0.5 font-medium">Administrator Operations Suite</div>
      </div>

      {/* Action CTA */}
      <div className="px-4 my-3 shrink-0">
        <NavLink
          to="/admin/ai/pipeline"
          className="w-full bg-primary text-on-primary py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors font-medium text-xs shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </NavLink>
      </div>

      {/* Nav Menu Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1.5 pr-2">
        {navSections.map((sec) => {
          const SecIcon = sec.icon;

          if (sec.singleRoute) {
            return (
              <NavLink
                key={sec.id}
                to={sec.path}
                end
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <SecIcon className="w-4 h-4" />
                  <span>{sec.label}</span>
                </div>
              </NavLink>
            );
          }

          const isOpen = !!openSections[sec.id];
          const hasActiveChild = sec.items.some(item => location.pathname === item.path);

          return (
            <div key={sec.id} className="space-y-1">
              {/* Section Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  hasActiveChild
                    ? 'text-primary bg-primary/10'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SecIcon className="w-4 h-4 text-on-surface-variant shrink-0" />
                  <span>{sec.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                )}
              </button>

              {/* Sub-Items */}
              {isOpen && (
                <div className="pl-6 space-y-1 border-l-2 border-outline-variant/60 ml-4 py-0.5">
                  {sec.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${isActive
                            ? 'bg-primary text-on-primary font-bold shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2">
                          <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-1 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider ${
                            item.badge === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/20 text-primary'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Divider */}
        <div className="my-3 border-t border-outline-variant/70"></div>

        {/* Secondary Links */}
        <div className="space-y-1 pb-4">
          <div className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Portals & Tools
          </div>
          {secondaryLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="px-6 pt-3 border-t border-outline-variant text-[11px] text-on-surface-variant flex items-center justify-between shrink-0">
        <span>v2.4.0 Enterprise</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Operational"></span>
      </div>
    </aside>
  );
}
