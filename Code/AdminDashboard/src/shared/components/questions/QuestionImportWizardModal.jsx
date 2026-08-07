import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import { UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2, FileText, X } from 'lucide-react';

export function QuestionImportWizardModal({ isOpen, onClose, onImportSuccess }) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);

  // Mock parsed questions from CSV file
  const mockImportItems = [
    { id: 'Q-IMP-01', title: 'Binary Tree Inorder Traversal', subject: 'Medical Entrance', type: 'Multiple Choice', difficulty: 'Easy', status: 'Valid' },
    { id: 'Q-IMP-02', title: 'Gradient Descent Optimization', subject: 'Chemistry', type: 'Multiple Correct', difficulty: 'Hard', status: 'Valid' },
    { id: 'Q-2026-0101', title: 'Time Complexity of Binary Search', subject: 'Medical Entrance', type: 'Multiple Choice', difficulty: 'Medium', status: 'Duplicate Prompt' },
    { id: 'Q-IMP-03', title: 'Fourier Transform Equation', subject: 'Mathematics', type: 'Numerical', difficulty: 'Hard', status: 'Valid' },
    { id: 'Q-IMP-04', title: 'Maxwell Equations Induction', subject: 'Physics', type: 'Descriptive', difficulty: 'Expert', status: 'Valid' }
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
        {
          id: 'Q-2026-0107',
          title: 'Binary Tree Inorder Traversal',
          prompt: 'What is the traversal sequence of an in-order tree traversal on a Binary Search Tree?',
          options: [
            { id: 'opt-a', text: 'Root, Left, Right', isCorrect: false },
            { id: 'opt-b', text: 'Left, Root, Right (Sorted Order)', isCorrect: true },
            { id: 'opt-c', text: 'Left, Right, Root', isCorrect: false }
          ],
          correctAnswerText: 'Left, Root, Right',
          explanation: 'In-order traversal visits left subtree, root, then right subtree, yielding sorted order for BSTs.',
          subject: 'Medical Entrance',
          topic: 'Trees & Search Graphs',
          chapter: 'Tree Traversals',
          difficulty: 'Easy',
          marks: 2,
          type: 'Multiple Choice',
          source: 'Bulk Import',
          status: 'Active',
          version: 'v1.0',
          lastUpdated: '2026-08-06',
          bloomsTaxonomy: 'Remember',
          tags: ['trees', 'traversal', 'algorithms'],
          versionHistory: []
        },
        {
          id: 'Q-2026-0108',
          title: 'Gradient Descent Optimization',
          prompt: 'Which learning rate behaviors occur when training a neural network?',
          options: [
            { id: 'opt-a', text: 'Too high rate causes divergence', isCorrect: true },
            { id: 'opt-b', text: 'Too low rate causes slow convergence', isCorrect: true }
          ],
          correctAnswerText: 'Options A and B',
          explanation: 'Large learning rates overshoot minima while small rates take excessive iterations.',
          subject: 'Chemistry',
          topic: 'Deep Learning',
          chapter: 'Optimization',
          difficulty: 'Hard',
          marks: 4,
          type: 'Multiple Correct',
          source: 'Bulk Import',
          status: 'Active',
          version: 'v1.0',
          lastUpdated: '2026-08-06',
          bloomsTaxonomy: 'Analyze',
          tags: ['optimization', 'gradient-descent'],
          versionHistory: []
        }
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
      title="Import Questions Wizard"
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
            {importing ? 'Ingesting Question Bank...' : 'Import Question Bank (4 Items)'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Upload Dropzone */}
        {!fileUploaded ? (
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:border-primary transition-colors bg-surface-bright">
            <UploadCloud className="w-10 h-10 text-primary mx-auto mb-3" />
            <div className="text-sm font-bold text-on-surface">Upload Question Bank File (.csv, .xlsx)</div>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
              File must contain header fields: <code className="font-mono bg-surface-container-high px-1 py-0.5 rounded text-primary">Prompt, Subject, Type, Difficulty, Marks, AnswerKey</code>
            </p>

            <div className="mt-4 inline-block">
              <label className="bg-primary text-on-primary hover:bg-opacity-90 px-4 py-2 rounded-md font-semibold text-xs cursor-pointer shadow-sm inline-flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Select Question File</span>
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
                <div className="text-xs font-bold text-on-surface">{fileName || 'question_bank_q3.csv'}</div>
                <div className="text-[10px] text-on-surface-variant">5 Questions Parsed • 12.8 KB</div>
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

        {/* Validation Summary */}
        {fileUploaded && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <div>
                  <div className="font-bold">4 Valid Items</div>
                  <div className="text-[10px]">Syntax & schema verified</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <div>
                  <div className="font-bold">1 Duplicate Prompt</div>
                  <div className="text-[10px]">Will be skipped</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-2 text-blue-800">
                <FileText className="w-4 h-4 shrink-0 text-blue-600" />
                <div>
                  <div className="font-bold">0 Errors</div>
                  <div className="text-[10px]">No malformed formulas</div>
                </div>
              </div>
            </div>

            {/* Parsed Preview Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Parsed Item Preview (5 Rows)
              </div>
              <Table headers={['Question ID', 'Title', 'Subject', 'Type', 'Difficulty', 'Status']}>
                {mockImportItems.map((item, idx) => (
                  <tr key={idx} className={item.status === 'Duplicate Prompt' ? 'bg-amber-500/5' : ''}>
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-primary">{item.id}</td>
                    <td className="px-4 py-2.5 font-semibold text-xs text-on-surface truncate max-w-xs">{item.title}</td>
                    <td className="px-4 py-2.5 text-xs text-on-surface-variant">{item.subject}</td>
                    <td className="px-4 py-2.5 text-xs font-mono">{item.type}</td>
                    <td className="px-4 py-2.5 text-xs">{item.difficulty}</td>
                    <td className="px-4 py-2.5 text-xs">
                      {item.status === 'Valid' ? (
                        <Badge variant="success">Valid</Badge>
                      ) : (
                        <Badge variant="warning">Duplicate</Badge>
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
