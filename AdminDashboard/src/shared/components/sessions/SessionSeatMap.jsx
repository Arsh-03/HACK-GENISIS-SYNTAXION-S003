import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { User, Monitor, ShieldCheck, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export function SessionSeatMap({ session }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Generate 2D seats layout grid (5 rows x 8 columns = 40 seats demo layout)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  // Map session roster onto seat codes
  const rosterMap = {};
  if (session?.roster) {
    session.roster.forEach(student => {
      if (student.seatNo) {
        rosterMap[student.seatNo] = student;
      }
    });
  }

  // Pre-fill dummy occupants for demo seats if roster is small
  const getSeatData = (seatCode) => {
    if (rosterMap[seatCode]) {
      return rosterMap[seatCode];
    }
    // Hardcode a few demo seats for visual richness
    if (seatCode === 'B-04') {
      return { id: 'STU-2026-0899', name: 'Jacob Miller', seatNo: 'B-04', terminalId: 'TERM-B-04', verificationStatus: 'Verified', attendanceStatus: 'Present' };
    }
    if (seatCode === 'C-03') {
      return { id: 'STU-2026-0900', name: 'Olivia Reed', seatNo: 'C-03', terminalId: 'TERM-C-03', verificationStatus: 'Pending', attendanceStatus: 'Scheduled' };
    }
    if (seatCode === 'D-06') {
      return { id: 'STU-2026-0901', name: 'Ethan Hunt', seatNo: 'D-06', terminalId: 'TERM-D-06', verificationStatus: 'Rejected', attendanceStatus: 'Absent' };
    }
    return null;
  };

  const getSeatColor = (student) => {
    if (!student) return 'bg-surface border-outline-variant hover:border-primary/50 text-on-surface-variant';

    if (student.attendanceStatus === 'Present' && student.verificationStatus === 'Verified') {
      return 'bg-emerald-500/15 border-emerald-500/80 hover:bg-emerald-500/25 text-emerald-900';
    }
    if (student.attendanceStatus === 'Scheduled' || student.verificationStatus === 'Pending') {
      return 'bg-amber-500/15 border-amber-500/80 hover:bg-amber-500/25 text-amber-900';
    }
    if (student.attendanceStatus === 'Absent' || student.verificationStatus === 'Rejected') {
      return 'bg-red-500/15 border-red-500/80 hover:bg-red-500/25 text-red-900';
    }
    return 'bg-emerald-500/15 border-emerald-500/80 text-emerald-900';
  };

  return (
    <div className="space-y-6">
      {/* Legend Header */}
      <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="font-bold text-on-surface flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" />
          <span>Exam Hall 2D Interactive Seat Map ({session?.room || 'Hall A'})</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600"></span>
            <span>Present & Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 border border-amber-600"></span>
            <span>Pending Check-in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500 border border-red-600"></span>
            <span>Absent / Flagged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300"></span>
            <span>Empty Desk</span>
          </div>
        </div>
      </div>

      {/* Podium Stage Banner */}
      <div className="w-full py-2 bg-surface-container-high border border-outline-variant rounded-lg text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">
        Invigilator Podium / Front Stage Screen
      </div>

      {/* 2D Seats Grid */}
      <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm overflow-x-auto">
        <div className="min-w-[700px] space-y-4">
          {rows.map(row => (
            <div key={row} className="flex items-center gap-3">
              <div className="w-6 font-mono font-bold text-xs text-on-surface-variant text-center shrink-0">
                Row {row}
              </div>

              <div className="flex-1 grid grid-cols-8 gap-3">
                {cols.map(col => {
                  const seatCode = `${row}-${col < 10 ? '0' + col : col}`;
                  const occupant = getSeatData(seatCode);
                  const colorClass = getSeatColor(occupant);

                  return (
                    <button
                      key={seatCode}
                      type="button"
                      onClick={() => setSelectedSeat({ seatCode, occupant })}
                      className={`p-2.5 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer shadow-xs flex flex-col justify-between h-20 ${colorClass}`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                        <span>{seatCode}</span>
                        {occupant ? (
                          <span className={`w-2 h-2 rounded-full ${
                            occupant.attendanceStatus === 'Present'
                              ? 'bg-emerald-500'
                              : occupant.attendanceStatus === 'Scheduled'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`} />
                        ) : (
                          <span className="text-slate-400 font-normal">Empty</span>
                        )}
                      </div>

                      {occupant ? (
                        <div>
                          <div className="text-[11px] font-bold truncate leading-tight">
                            {occupant.name}
                          </div>
                          <div className="text-[9px] font-mono opacity-80 truncate">
                            {occupant.terminalId || `TERM-${seatCode}`}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-400">
                          {`TERM-${seatCode}`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Details Modal */}
      {selectedSeat && (
        <Modal
          isOpen={!!selectedSeat}
          onClose={() => setSelectedSeat(null)}
          title={`Desk ${selectedSeat.seatCode} Overview`}
          icon={Monitor}
          iconBg="bg-primary/10 text-primary"
          footer={
            <Button variant="primary" onClick={() => setSelectedSeat(null)} className="w-full">
              Close Overview
            </Button>
          }
        >
          {selectedSeat.occupant ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center">
                  {selectedSeat.occupant.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-on-surface">{selectedSeat.occupant.name}</div>
                  <div className="text-xs text-on-surface-variant font-mono">{selectedSeat.occupant.id}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-lg bg-surface-bright border border-outline-variant">
                <div>
                  <span className="text-on-surface-variant block font-medium">Assigned Seat</span>
                  <span className="font-bold text-on-surface font-mono">{selectedSeat.seatCode}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Terminal Hardware ID</span>
                  <span className="font-bold text-primary font-mono">{selectedSeat.occupant.terminalId || `TERM-${selectedSeat.seatCode}`}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Biometric Status</span>
                  <span className="font-bold text-emerald-600">{selectedSeat.occupant.verificationStatus}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block font-medium">Attendance Status</span>
                  <span className="font-bold text-on-surface">{selectedSeat.occupant.attendanceStatus}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-2">
              <div className="text-sm font-bold text-on-surface">Desk {selectedSeat.seatCode} is currently Unassigned</div>
              <p className="text-xs text-on-surface-variant">
                Terminal ID <code className="font-mono bg-surface-container-high px-1 py-0.5 rounded text-primary">TERM-{selectedSeat.seatCode}</code> is available for candidate allocation.
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
