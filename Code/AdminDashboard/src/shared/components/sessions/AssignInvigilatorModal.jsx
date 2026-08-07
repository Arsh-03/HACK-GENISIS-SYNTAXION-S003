import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MOCK_INVIGILATORS } from '../../../services/mockSessions';
import { UserCheck, ShieldAlert, AlertTriangle, CheckCircle2, User, Phone } from 'lucide-react';

export function AssignInvigilatorModal({
  isOpen,
  onClose,
  session,
  onConfirmAssignment
}) {
  const [selectedInvigilatorName, setSelectedInvigilatorName] = useState(
    session?.assignedInvigilator || MOCK_INVIGILATORS[0].name
  );

  if (!isOpen || !session) return null;

  // Conflict Detection Logic:
  // Elena Rostova has conflict for testing demo! Or if selected invigilator matches Elena Rostova
  const isConflict = selectedInvigilatorName === 'Elena Rostova';
  const conflictReason = isConflict
    ? 'Elena Rostova is already supervising NEET-CHE Final in North Wing (01:30 PM - 04:30 PM) on 2026-08-15.'
    : null;

  // Suggested alternatives (invigilators with zero or available status)
  const suggestedAlternatives = MOCK_INVIGILATORS.filter(
    inv => inv.name !== selectedInvigilatorName && inv.status !== 'Conflict'
  );

  const handleConfirm = () => {
    if (isConflict) {
      if (!window.confirm('Warning: Scheduling conflict detected! Are you sure you want to override and assign this invigilator?')) {
        return;
      }
    }
    onConfirmAssignment(session.code, selectedInvigilatorName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Invigilator: ${session.code}`}
      icon={UserCheck}
      iconBg="bg-primary/10 text-primary"
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isConflict ? 'warning' : 'primary'}
            onClick={handleConfirm}
          >
            {isConflict ? 'Override & Confirm' : 'Confirm Assignment'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Session Brief */}
        <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-on-surface">{session.examName}</div>
            <div className="text-on-surface-variant font-mono text-[11px]">
              {session.date} • {session.startTime} - {session.endTime} ({session.room})
            </div>
          </div>
          <Badge variant="info">Capacity: {session.capacity}</Badge>
        </div>

        {/* Conflict Warning Banner if selected invigilator has overlap */}
        {isConflict && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div className="space-y-1">
              <div className="font-bold text-red-900">Scheduling Conflict Detected!</div>
              <div>{conflictReason}</div>
              <div className="text-[11px] font-semibold text-red-800">
                Please select a suggested alternative invigilator below.
              </div>
            </div>
          </div>
        )}

        {/* Available Invigilators List */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Select Invigilator Supervisor
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {MOCK_INVIGILATORS.map(inv => {
              const selected = selectedInvigilatorName === inv.name;
              const hasConflict = inv.status === 'Conflict';

              return (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => setSelectedInvigilatorName(inv.name)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selected
                      ? hasConflict
                        ? 'border-red-500 bg-red-500/10 font-bold'
                        : 'border-primary bg-primary/10 font-bold'
                      : 'border-outline-variant bg-surface-bright hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center">
                      {inv.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                        <span>{inv.name}</span>
                        {hasConflict && <Badge variant="danger">Conflict</Badge>}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono">{inv.email}</div>
                    </div>
                  </div>

                  <div className="text-right text-[11px]">
                    <span className="text-on-surface-variant block">Active Slots: {inv.activeSessionsCount}</span>
                    <span className={selected ? 'text-primary font-bold' : 'text-slate-400'}>
                      {selected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Alternatives if Conflict */}
        {isConflict && suggestedAlternatives.length > 0 && (
          <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant space-y-1.5 text-xs">
            <div className="font-bold text-on-surface-variant uppercase text-[10px]">
              Suggested Conflict-Free Alternatives
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedAlternatives.map(alt => (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => setSelectedInvigilatorName(alt.name)}
                  className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 font-semibold text-[11px] hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{alt.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
