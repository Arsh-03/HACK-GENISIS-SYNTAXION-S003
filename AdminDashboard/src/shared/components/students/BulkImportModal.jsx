import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import { UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2, FileText, X } from 'lucide-react';

export function BulkImportModal({ isOpen, onClose, onImportSuccess }) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);

  // Mock parsed CSV preview data
  const mockCsvRecords = [
    { id: 'STU-2026-0901', name: 'Jordan Rivera', email: 'jordan.r@university.edu', department: 'Medical Entrance', status: 'Valid' },
    { id: 'STU-2026-0902', name: 'Samantha Reed', email: 'samantha.r@university.edu', department: 'Data Science', status: 'Valid' },
    { id: 'STU-2026-0891', name: 'Alex Chen', email: 'alex.chen@university.edu', department: 'Medical Entrance', status: 'Duplicate ID' },
    { id: 'STU-2026-0903', name: 'Benjamin Hayes', email: 'benjamin.h@university.edu', department: 'Cybersecurity', status: 'Valid' },
    { id: 'STU-2026-0904', name: 'Maya Lin', email: 'maya.lin@university.edu', department: 'Chemistry', status: 'Valid' }
  ];

  const handleSimulateUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileUploaded(true);
    }
  };

  const handleConfirmImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      onImportSuccess([
        { id: 'STU-2026-0901', name: 'Jordan Rivera', email: 'jordan.r@university.edu', phone: '+1 (555) 111-2222', session: 'Unassigned', verificationStatus: 'Pending', faceMatchScore: 88.0, registrationStatus: 'Active', avatar: 'JR', department: 'Medical Entrance', batchYear: '2026', enrollmentNo: 'CS2026-0901', gpa: '3.70' },
        { id: 'STU-2026-0902', name: 'Samantha Reed', email: 'samantha.r@university.edu', phone: '+1 (555) 222-3333', session: 'Unassigned', verificationStatus: 'Pending', faceMatchScore: 92.5, registrationStatus: 'Active', avatar: 'SR', department: 'Data Science', batchYear: '2026', enrollmentNo: 'DS2026-0902', gpa: '3.82' },
        { id: 'STU-2026-0903', name: 'Benjamin Hayes', email: 'benjamin.h@university.edu', phone: '+1 (555) 333-4444', session: 'Unassigned', verificationStatus: 'Pending', faceMatchScore: 84.1, registrationStatus: 'Active', avatar: 'BH', department: 'Cybersecurity', batchYear: '2026', enrollmentNo: 'CY2026-0903', gpa: '3.65' }
      ]);
      setFileUploaded(false);
      setFileName('');
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Candidates"
      icon={FileSpreadsheet}
      iconBg="bg-primary/10 text-primary"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={importing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmImport}
            disabled={!fileUploaded || importing}
          >
            {importing ? 'Importing Roster...' : 'Confirm Roster Import (4 Valid)'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Upload Dropzone */}
        {!fileUploaded ? (
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:border-primary transition-colors bg-surface-bright">
            <UploadCloud className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-sm font-bold text-on-surface">Upload Candidate CSV or Excel Roster</div>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
              File must contain columns: <code className="font-mono bg-surface-container-high px-1 py-0.5 rounded text-primary">Student_ID, Name, Email, Department</code>
            </p>

            <div className="mt-4 inline-block">
              <label className="bg-primary text-on-primary hover:bg-opacity-90 px-4 py-2 rounded-md font-semibold text-xs cursor-pointer shadow-sm inline-flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Select Roster File (.csv, .xlsx)</span>
                <input
                  type="file"
                  accept=".csv, .xlsx"
                  className="hidden"
                  onChange={handleSimulateUpload}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-surface-bright border border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-on-surface">{fileName || 'candidate_roster_2026.csv'}</div>
                <div className="text-[10px] text-on-surface-variant">5 Records Detected • 4.2 KB</div>
              </div>
            </div>
            <button
              onClick={() => setFileUploaded(false)}
              className="text-on-surface-variant hover:text-red-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Validation & Duplicate Detection Summary */}
        {fileUploaded && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <div>
                  <div className="font-bold">4 Valid Records</div>
                  <div className="text-[10px]">Ready for ingestion</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <div>
                  <div className="font-bold">1 Duplicate ID</div>
                  <div className="text-[10px]">Will be skipped</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-2 text-blue-800">
                <FileText className="w-4 h-4 shrink-0 text-blue-600" />
                <div>
                  <div className="font-bold">0 Formatting Errors</div>
                  <div className="text-[10px]">Syntax check passed</div>
                </div>
              </div>
            </div>

            {/* CSV Preview Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Parsed CSV Preview (First 5 Rows)
              </div>
              <Table headers={['Student ID', 'Full Name', 'Email', 'Department', 'Validation Status']}>
                {mockCsvRecords.map((rec, idx) => (
                  <tr key={idx} className={rec.status === 'Duplicate ID' ? 'bg-amber-500/5' : ''}>
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-primary">{rec.id}</td>
                    <td className="px-4 py-2.5 font-semibold text-xs">{rec.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-on-surface-variant">{rec.email}</td>
                    <td className="px-4 py-2.5 text-xs text-on-surface-variant">{rec.department}</td>
                    <td className="px-4 py-2.5 text-xs">
                      {rec.status === 'Valid' ? (
                        <Badge variant="success">Valid</Badge>
                      ) : (
                        <Badge variant="warning">Duplicate ID</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
