import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Badge } from '../shared/components/ui/Badge';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { Modal } from '../shared/components/ui/Modal';
import {
  HelpCircle,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Activity,
  Send,
  LifeBuoy,
  FileText,
  Shield,
  Bot
} from 'lucide-react';
import { mockFaqList } from '../services/mockData';

export function HelpSupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // Diagnostic tool state
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const filteredFaqs = mockFaqList.filter(f =>
    f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runDiagnostics = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosticResult({
        ping: "12ms",
        bandwidth: "45 Mbps",
        webcam: "Passed (1080p)",
        browser: "Chrome v126 (Kiosk Lockdown Ready)",
        status: "OPTIMAL_HEALTH"
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">Help Center & Documentation Hub</h1>
            <Badge variant="mono" size="sm">ENTERPRISE SUPPORT</Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Documentation, user manuals, system diagnostics bandwidth checker, and support ticketing.
          </p>
        </div>

        <Button
          variant="primary"
          icon={LifeBuoy}
          onClick={() => setIsContactModalOpen(true)}
          className="font-bold text-xs"
        >
          Contact Technical Support
        </Button>
      </div>

      {/* Hero Search Bar */}
      <div className="bg-gradient-to-r from-primary to-indigo-800 text-white p-6 md:p-8 rounded-2xl shadow-md space-y-4">
        <h2 className="text-xl font-black">How can we assist your examination center?</h2>
        <div className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2.5 rounded-xl max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search documentation, proctoring rules, or FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm font-medium focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Diagnostics Tool & Quick Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Diagnostic Tool */}
        <Card title="Workstation System Diagnostics" subtitle="Verify bandwidth, ping latency, and kiosk hardware compliance">
          <div className="space-y-4 text-xs">
            <p className="text-on-surface-variant leading-relaxed">
              Run automated checks to verify your invigilator dashboard connection health and kiosk lockdown engine status.
            </p>

            {diagnosticResult && (
              <div className="space-y-2 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 font-mono text-[11px]">
                <div className="font-bold text-emerald-950 text-xs font-sans">System Diagnostics: OPTIMAL</div>
                <div>Ping Latency: <strong>{diagnosticResult.ping}</strong></div>
                <div>Bandwidth: <strong>{diagnosticResult.bandwidth}</strong></div>
                <div>Webcam Hardware: <strong>{diagnosticResult.webcam}</strong></div>
                <div>Kiosk Browser: <strong>{diagnosticResult.browser}</strong></div>
              </div>
            )}

            <Button
              variant="secondary"
              icon={Activity}
              onClick={runDiagnostics}
              disabled={isDiagnosing}
              className="w-full text-xs"
            >
              {isDiagnosing ? "Running Diagnostics..." : "Run Bandwidth & Kiosk Diagnostic"}
            </Button>
          </div>
        </Card>

        {/* Documentation Guides */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Frequently Asked Questions & Manuals" subtitle="Common invigilator procedures and AI pipeline guidelines">
            <div className="space-y-3 text-xs">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border border-outline-variant rounded-xl overflow-hidden bg-surface-bright">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left font-bold text-on-surface flex items-center justify-between hover:bg-surface-variant transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-primary" /> : <ChevronRight className="w-4 h-4 shrink-0 text-on-surface-variant" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-on-surface-variant border-t border-outline-variant/60 leading-relaxed mt-2 bg-surface-container-lowest">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>

      {/* Contact Support Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Contact Enterprise Support Engineers"
        icon={LifeBuoy}
        iconBg="bg-primary/20 text-primary"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={Send}
              onClick={() => {
                alert("Support ticket dispatched! An enterprise engineer will respond within 15 minutes.");
                setIsContactModalOpen(false);
              }}
            >
              Dispatch Ticket
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Ticket Subject"
            placeholder="e.g. Question Bank import error in Section B"
            value={supportSubject}
            onChange={(e) => setSupportSubject(e.target.value)}
          />
          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Issue Details & Steps to Reproduce</label>
            <textarea
              rows={4}
              placeholder="Describe the issue in detail..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
