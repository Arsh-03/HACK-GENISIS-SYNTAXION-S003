import React, { useState } from 'react';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';
import { FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useCandidates } from '../hooks/useCandidates';

export function BulkImportPage() {
  const { refresh } = useCandidates();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' or 'error'

  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus(null);
    
    // Simulate parsing the CSV since this is a demo, we'll send a mock JSON payload
    // In production, we would use PapaParse to parse the actual CSV content
    setTimeout(async () => {
      try {
        const mockParsedData = [
          { name: 'Imported User 1', email: 'imported1@example.com', candidateId: 'IMP1001' },
          { name: 'Imported User 2', email: 'imported2@example.com', candidateId: 'IMP1002' },
        ];

        const res = await fetch('http://localhost:5001/api/candidates/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: mockParsedData })
        });
        
        if (!res.ok) throw new Error('Upload failed');
        setUploadStatus('success');
        refresh(); // Refresh the cache
      } catch (err) {
        setUploadStatus('error');
      } finally {
        setIsUploading(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-3.5">
        <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-on-surface">Bulk Candidate Import</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Upload a CSV roster file to register multiple candidates into the database instantly.
          </p>
        </div>
      </div>

      <Card>
        <div 
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors ${
            file ? 'border-primary/50 bg-primary/5' : 'border-outline-variant hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {uploadStatus === 'success' ? (
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Import Successful!</h3>
                <p className="text-sm text-on-surface-variant">Your candidates have been securely imported into the database.</p>
              </div>
              <Button onClick={() => { setFile(null); setUploadStatus(null); }}>Import Another File</Button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              
              <h3 className="text-lg font-bold text-on-surface mb-2">
                {file ? file.name : 'Drag & Drop your CSV file here'}
              </h3>
              <p className="text-sm text-on-surface-variant mb-6 max-w-md">
                {file 
                  ? `File size: ${(file.size / 1024).toFixed(2)} KB` 
                  : 'File must contain headers: name, email, candidateId. Maximum file size is 10MB.'}
              </p>
              
              {!file ? (
                <div>
                  <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleFileChange} />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Button variant="primary" as="span">Browse Files</Button>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading}>Cancel</Button>
                  <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Confirm Upload'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
