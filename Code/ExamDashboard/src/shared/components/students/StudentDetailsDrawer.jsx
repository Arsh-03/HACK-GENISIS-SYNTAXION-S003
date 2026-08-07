import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  ShieldCheck,
  Clock,
  FileText,
  KeyRound,
  Edit,
  UserX,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Building,
  Image as ImageIcon
} from 'lucide-react';

export function StudentDetailsDrawer({
  student,
  isOpen,
  onClose,
  onEdit,
  onAssignSession,
  onResetPassword,
  onToggleStatus,
  onAddNote
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNoteText, setNewNoteText] = useState('');

  if (!isOpen || !student) return null;

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    if (onAddNote) {
      onAddNote(student.id, newNoteText);
    }
    setNewNoteText('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col justify-between">
          
          {/* Top Header */}
          <div className="p-6 bg-surface-bright border-b border-outline-variant flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold text-base flex items-center justify-center shadow-sm">
                {student.avatar || student.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-on-surface">{student.name}</h2>
                  {getStatusBadge(student.verificationStatus)}
                </div>
                <div className="text-xs text-on-surface-variant font-mono mt-0.5 flex items-center gap-2">
                  <span>ID: <strong className="text-primary">{student.id}</strong></span>
                  <span>•</span>
                  <span>{student.department}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 bg-surface-bright border-b border-outline-variant flex gap-6 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Overview & Identity
            </button>
            <button
              onClick={() => setActiveTab('session')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'session'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Exam Session
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Timelines
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Admin Notes ({student.notes?.length || 0})
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: OVERVIEW & IDENTITY */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Face Match Score Box */}
                <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      student.faceMatchScore >= 85
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : student.faceMatchScore >= 70
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}>
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Biometric Facial Match Score
                      </div>
                      <div className="text-2xl font-black text-on-surface font-mono">
                        {student.faceMatchScore}%
                      </div>
                    </div>
                  </div>

                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>Confidence</span>
                      <span>{student.faceMatchScore >= 85 ? 'High' : 'Review Req.'}</span>
                    </div>
                    <ProgressBar
                      progress={student.faceMatchScore}
                      color={
                        student.faceMatchScore >= 85
                          ? 'bg-emerald-600'
                          : student.faceMatchScore >= 70
                          ? 'bg-amber-500'
                          : 'bg-red-600'
                      }
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-bright border border-outline-variant text-xs">
                    <div>
                      <span className="text-on-surface-variant block font-medium">Full Name</span>
                      <span className="font-bold text-on-surface">{student.name}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Email Address</span>
                      <span className="font-bold text-on-surface font-mono">{student.email}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Phone Number</span>
                      <span className="font-bold text-on-surface font-mono">{student.phone}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Date of Birth</span>
                      <span className="font-bold text-on-surface">{student.dob || '1998-04-12'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant block font-medium">Address</span>
                      <span className="font-semibold text-on-surface">{student.address || 'Campus Housing Quad'}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-outline-variant/60">
                      <span className="text-on-surface-variant block font-medium">Emergency Contact</span>
                      <span className="font-semibold text-on-surface">{student.emergencyContact || 'Not recorded'}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-primary" /> Academic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-bright border border-outline-variant text-xs">
                    <div>
                      <span className="text-on-surface-variant block font-medium">Department</span>
                      <span className="font-bold text-on-surface">{student.department}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Batch Year</span>
                      <span className="font-bold text-on-surface font-mono">{student.batchYear}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Enrollment No.</span>
                      <span className="font-bold text-on-surface font-mono">{student.enrollmentNo}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Academic GPA</span>
                      <span className="font-bold text-primary font-mono">{student.gpa} / 4.00</span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Biometric Documents */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" /> Uploaded Verification Media
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-surface-bright border border-outline-variant space-y-2">
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase">Candidate Live Photo</div>
                      <div className="aspect-4/3 rounded-lg bg-surface-container-high overflow-hidden relative group">
                        <img
                          src={student.photoUrl}
                          alt="Candidate Portrait"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          Live Capture Pass
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-bright border border-outline-variant space-y-2">
                      <div className="text-[11px] font-bold text-on-surface-variant uppercase">Government ID Scan</div>
                      <div className="aspect-4/3 rounded-lg bg-surface-container-high overflow-hidden relative group">
                        <img
                          src={student.idCardUrl}
                          alt="ID Card Scan"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          OCR Scanned
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXAM SESSION */}
            {activeTab === 'session' && (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-surface-bright border border-outline-variant space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase text-on-surface-variant">Active Assignment</div>
                        <h4 className="text-base font-bold text-on-surface">{student.session}</h4>
                      </div>
                    </div>
                    <Badge variant={student.session === 'Unassigned' ? 'warning' : 'success'}>
                      {student.session === 'Unassigned' ? 'Unassigned' : 'Confirmed'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-outline-variant/60">
                    <div>
                      <span className="text-on-surface-variant block font-medium">Assigned Exam Hall</span>
                      <span className="font-bold text-on-surface">Main Campus - Hall A (Seat #42)</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Exam Date & Time</span>
                      <span className="font-bold text-on-surface font-mono">Aug 15, 2026 • 10:00 AM</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Terminal IP Binding</span>
                      <span className="font-mono text-primary font-bold">192.168.10.142</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block font-medium">Proctor Supervisor</span>
                      <span className="font-bold text-on-surface">Marcus Vance (Invigilator)</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => onAssignSession(student)}
                      variant="outline"
                      className="w-full text-xs font-semibold"
                    >
                      Reassign Exam Session
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TIMELINES */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                {/* Verification Audit Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verification Audit Steps
                  </h3>
                  <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-4">
                    {student.verificationTimeline?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative">
                        <div className={`p-1.5 rounded-full shrink-0 mt-0.5 ${
                          item.status === 'Passed' || item.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-600'
                            : item.status === 'Flagged' || item.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-600'
                            : 'bg-red-500/20 text-red-600'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{item.step}</div>
                          <div className="text-[11px] font-mono text-on-surface-variant">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity & Access Logs */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> Candidate Portal Activity Logs
                  </h3>
                  <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant space-y-3">
                    {student.activityTimeline?.length > 0 ? (
                      student.activityTimeline.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant/50 last:border-0">
                          <div>
                            <span className="font-semibold text-on-surface block">{item.action}</span>
                            <span className="text-[10px] font-mono text-on-surface-variant">{item.time}</span>
                          </div>
                          <span className="font-mono text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">
                            {item.ip}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-on-surface-variant italic">No recent login activity recorded.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ADMIN NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleNoteSubmit} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                    Append Administrative Note
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 bg-surface-bright border border-outline-variant rounded-md text-xs text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter observation notes, accommodation notes, or verification comments..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                  />
                  <Button type="submit" variant="primary" size="sm" icon={Plus}>
                    Add Note
                  </Button>
                </form>

                <div className="space-y-3 pt-2">
                  {student.notes?.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-surface-bright border border-outline-variant space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-primary">{note.author}</span>
                        <span className="text-on-surface-variant font-mono">{note.date}</span>
                      </div>
                      <p className="text-xs text-on-surface leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Action Footer */}
          <div className="p-4 bg-surface-bright border-t border-outline-variant flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onEdit(student)}
                variant="outline"
                size="sm"
                icon={Edit}
              >
                Edit
              </Button>
              <Button
                onClick={() => onResetPassword(student)}
                variant="outline"
                size="sm"
                icon={KeyRound}
              >
                Reset Pass
              </Button>
              <Button
                onClick={() => onAssignSession(student)}
                variant="outline"
                size="sm"
                icon={Building}
              >
                Assign Session
              </Button>
            </div>

            <Button
              onClick={() => onToggleStatus(student)}
              variant={student.registrationStatus === 'Active' ? 'danger' : 'secondary'}
              size="sm"
              icon={UserX}
            >
              {student.registrationStatus === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
