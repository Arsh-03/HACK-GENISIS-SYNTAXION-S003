import React from 'react';
import { Card } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LayoutDashboard, GraduationCap, ArrowRight, UserCheck, CheckCircle } from 'lucide-react';

export function RoleSelectionPage() {
  const { user, setSelectedRole } = useAuth();

  const roles = [
    {
      id: 'Administrator',
      title: 'Administrator',
      subtitle: 'System Operations & Security',
      description: 'Manage exam creation, AI question paper generation, candidate enrollment, system security, and analytics telemetry.',
      icon: LayoutDashboard,
      iconBg: 'bg-primary/10 text-primary',
      badge: 'Full Access',
      badgeVariant: 'default',
      features: ['AI Paper Pipeline', 'User & Exam Management', 'System Telemetry'],
      path: '/admin',
    },
    {
      id: 'Invigilator',
      title: 'Invigilator',
      subtitle: 'Live Proctoring & Monitoring',
      description: 'Real-time candidate proctoring, webcam feed monitoring, anti-cheat flag resolution, and live assessment supervision.',
      icon: ShieldAlert,
      iconBg: 'bg-amber-500/10 text-amber-600',
      badge: 'Live Operations',
      badgeVariant: 'warning',
      features: ['Live Video Stream Monitoring', 'AI Anomaly Flags', 'Student Communication'],
      path: '/invigilator',
    },
    {
      id: 'Candidate',
      title: 'Candidate',
      subtitle: 'Focus Mode Exam Portal',
      description: 'Secure exam environment with automated proctoring, timer alerts, question navigation palette, and immediate submission.',
      icon: GraduationCap,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      badge: 'Exam Mode',
      badgeVariant: 'success',
      features: ['Fullscreen Focus Mode', 'Dynamic Question Palette', 'Real-time Timer'],
      path: '/exam',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <UserCheck className="w-4 h-4" />
          <span>Authenticated as {user?.name || 'Authorized User'}</span>
        </div>
        <h1 className="text-3xl font-black text-on-surface tracking-tight">Select Active Portal</h1>
        <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
          Choose the role environment you wish to operate in for this CBT session.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.id}
              className="flex flex-col justify-between hover:border-primary hover:shadow-lg transition-all duration-200 group bg-surface-container-lowest"
            >
              <div className="space-y-4">
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${role.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant={role.badgeVariant}>{role.badge}</Badge>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <div className="text-xs font-medium text-on-surface-variant mt-0.5">
                    {role.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {role.description}
                </p>

                {/* Key Features */}
                <div className="pt-2 border-t border-outline-variant/60 space-y-1.5">
                  {role.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4">
                <Button
                  onClick={() => setSelectedRole(role.id)}
                  variant="primary"
                  className="w-full py-2 text-xs font-semibold flex items-center justify-center gap-2 group-hover:bg-primary-hover shadow-sm"
                >
                  <span>Continue as {role.title}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
