import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import { Bell, Cpu, AlertTriangle, Calendar, CheckCircle2, Check } from 'lucide-react';
import { mockNotificationsList } from '../services/mockData';

export function SystemNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotificationsList);
  const [selectedType, setSelectedType] = useState('ALL');

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifs = notifications.filter(n => selectedType === 'ALL' || n.type === selectedType);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Notification & Alert Center</h1>
            <Badge variant="mono" size="sm">TELEMETRY BROADCAST</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time system alerts, AI pipeline completion events, security flags, and session broadcasts.
          </p>
        </div>

        <Button
          variant="outline"
          icon={Check}
          onClick={handleMarkAllRead}
          className="text-xs font-semibold"
        >
          Mark All as Read
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-1 overflow-x-auto no-scrollbar">
        {['ALL', 'AI', 'SECURITY', 'SYSTEM', 'EXAM'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === type
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {type === 'ALL' ? 'All Alerts' : `${type} Alerts`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card title="Broadcast & Alert Feed" subtitle="Real-time notifications categorized by severity and event source">
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                !n.isRead
                  ? 'bg-indigo-50/50 border-indigo-200'
                  : 'bg-surface-bright border-outline-variant'
              }`}
            >
              <div className="p-2 bg-surface-container-lowest rounded-lg border border-outline-variant shrink-0 mt-0.5">
                {n.type === 'AI' && <Cpu className="w-5 h-5 text-indigo-600" />}
                {n.type === 'SECURITY' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                {n.type === 'SYSTEM' && <Bell className="w-5 h-5 text-amber-600" />}
                {n.type === 'EXAM' && <Calendar className="w-5 h-5 text-emerald-600" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">{n.title}</span>
                    <Badge variant={n.type === 'SECURITY' ? 'danger' : 'mono'} size="sm">{n.type}</Badge>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant">{n.timestamp}</span>
                </div>
                <div className="text-xs text-on-surface-variant leading-relaxed">{n.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
