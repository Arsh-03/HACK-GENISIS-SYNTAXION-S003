import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { KeyRound, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';

export function ResetCredentialsModal({ isOpen, onClose, student }) {
  const [copied, setCopied] = useState(false);
  const [tempPassword] = useState(`Nexis@${Math.floor(1000 + Math.random() * 9000)}!`);

  if (!isOpen || !student) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reset Credentials: ${student.name}`}
      icon={KeyRound}
      iconBg="bg-primary/10 text-primary"
      footer={
        <Button variant="primary" onClick={onClose} className="w-full">
          Done & Close
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-on-surface-variant leading-relaxed">
          A new temporary password has been generated for candidate{' '}
          <strong className="text-on-surface">{student.name}</strong> ({student.email}).
        </p>

        <div className="p-4 rounded-xl bg-surface-bright border border-outline-variant text-center space-y-2">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Temporary Login Credential
          </div>
          <div className="text-xl font-bold font-mono text-primary tracking-wider bg-surface-container-lowest py-2 px-4 rounded border border-outline-variant inline-block">
            {tempPassword}
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={copied ? CheckCircle2 : Copy}
              onClick={handleCopy}
              className="text-xs font-semibold"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Temporary Password'}
            </Button>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <strong>Security Notice:</strong> The candidate will be forced to change this temporary password upon their next login to the CBT Portal.
          </div>
        </div>
      </div>
    </Modal>
  );
}
