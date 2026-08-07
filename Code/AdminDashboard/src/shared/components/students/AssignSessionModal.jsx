import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { MOCK_EXAM_SESSIONS } from '../../../services/mockStudents';
import { Building, Calendar, Grid, Users } from 'lucide-react';

export function AssignSessionModal({
  isOpen,
  onClose,
  targetStudents = [],
  onConfirmAssignment
}) {
  const [selectedSession, setSelectedSession] = useState(MOCK_EXAM_SESSIONS[0]);
  const [hall, setHall] = useState('Main Campus - Hall A');
  const [allocationMode, setAllocationMode] = useState('randomized');

  if (!isOpen) return null;

  const count = targetStudents.length;

  const handleConfirm = () => {
    onConfirmAssignment(targetStudents.map(s => s.id), selectedSession);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={count === 1 ? `Assign Session: ${targetStudents[0]?.name}` : `Bulk Assign Session (${count} Candidates)`}
      icon={Building}
      iconBg="bg-primary/10 text-primary"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm Session Assignment
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Selected Candidates Summary */}
        <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant flex items-center gap-2.5 text-xs text-on-surface-variant">
          <Users className="w-4 h-4 text-primary shrink-0" />
          <div>
            Assigning <strong className="text-on-surface">{count} candidate(s)</strong> to an active examination session schedule.
          </div>
        </div>

        {/* Select Session */}
        <Select
          label="Target Examination Session"
          options={MOCK_EXAM_SESSIONS.map(s => ({ label: s, value: s }))}
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        />

        {/* Exam Hall Selection */}
        <Select
          label="Assigned Test Center / Hall"
          options={[
            { label: 'Main Campus - Hall A (Seats 1-120)', value: 'Main Campus - Hall A' },
            { label: 'North Wing - Room 302 (Seats 1-45)', value: 'North Wing - Room 302' },
            { label: 'AI Innovation Lab 4 (Seats 1-60)', value: 'AI Innovation Lab 4' }
          ]}
          value={hall}
          onChange={(e) => setHall(e.target.value)}
        />

        {/* Seat Allocation Strategy */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
            Seat Mapping Strategy
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setAllocationMode('randomized')}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                allocationMode === 'randomized'
                  ? 'border-primary bg-primary/10 font-bold text-primary'
                  : 'border-outline-variant bg-surface-bright text-on-surface-variant'
              }`}
            >
              <Grid className="w-4 h-4 shrink-0" />
              <div>
                <div>Randomized Seat Map</div>
                <div className="text-[10px] opacity-80">Anti-cheat positioning</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAllocationMode('sequential')}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                allocationMode === 'sequential'
                  ? 'border-primary bg-primary/10 font-bold text-primary'
                  : 'border-outline-variant bg-surface-bright text-on-surface-variant'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <div>
                <div>Sequential Roster</div>
                <div className="text-[10px] opacity-80">In order of Student ID</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
