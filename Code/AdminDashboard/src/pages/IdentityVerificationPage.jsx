import React, { useMemo } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import { useCandidates } from '../hooks/useCandidates';
import { ShieldCheck, CheckCircle2, AlertTriangle, Eye, Clock } from 'lucide-react';

export function IdentityVerificationPage() {
  const { candidates: students, isLoading } = useCandidates();

  const pendingStudents = useMemo(() => {
    return students.filter(s => s.verificationStatus === 'Pending' || s.verificationStatus === 'Rejected');
  }, [students]);

  if (isLoading) return <div className="p-8 text-center animate-pulse text-on-surface-variant">Loading verification statuses...</div>;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3.5">
        <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-on-surface">Identity Verification Queue</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Review and approve candidates who flagged in the automated facial recognition pipeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-full"><CheckCircle2 className="w-8 h-8" /></div>
          <div>
            <div className="text-sm font-bold text-on-surface-variant uppercase">Automatically Verified</div>
            <div className="text-3xl font-black font-mono">{students.filter(s=>s.verificationStatus === 'Verified').length}</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-amber-500/50">
          <div className="p-4 bg-amber-500/10 text-amber-600 rounded-full"><AlertTriangle className="w-8 h-8" /></div>
          <div>
            <div className="text-sm font-bold text-on-surface-variant uppercase">Require Manual Review</div>
            <div className="text-3xl font-black font-mono text-amber-600">{pendingStudents.length}</div>
          </div>
        </Card>
      </div>

      <h2 className="text-lg font-bold text-on-surface pt-4">Pending Review Queue</h2>
      <Table headers={['Candidate', 'Status', 'Match Confidence', 'Action']}>
        {pendingStudents.length > 0 ? (
          pendingStudents.map((student) => (
            <tr key={student.id} className="hover:bg-surface-bright/80 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center`}>
                    {student.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{student.name}</div>
                    <div className="text-[10px] text-on-surface-variant">{student.candidateId}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><Badge variant="warning">{student.verificationStatus}</Badge></td>
              <td className="px-4 py-3">
                <div className="w-32 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-amber-700">{student.faceMatchScore || 72.4}%</div>
                  <ProgressBar progress={student.faceMatchScore || 72.4} color="bg-amber-500" />
                </div>
              </td>
              <td className="px-4 py-3">
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Review
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan={4} className="px-4 py-8 text-center text-xs text-on-surface-variant">The review queue is currently empty.</td></tr>
        )}
      </Table>
    </div>
  );
}
