import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Modal } from '../../shared/components/ui/Modal';
import { PasswordStrengthIndicator } from '../../shared/components/auth/PasswordStrengthIndicator';
import { mockAuthService } from '../../services/mockAuth';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Eye, EyeOff, CheckCircle2, ShieldAlert, ArrowRight, AlertCircle } from 'lucide-react';

export function FirstLoginPasswordChangePage() {
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTemp, setShowTemp] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { pendingTempUser, setUser, setPendingTempUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tempPassword === newPassword) {
      setError('Your new password cannot be the same as your temporary password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await mockAuthService.changeFirstLoginPassword(tempPassword, newPassword);
      
      // Update pending temp user to active user with isFirstLogin: false
      const updatedUser = {
        ...(pendingTempUser || {
          id: 'user-004',
          name: 'David Miller',
          email: 'temp@nexiscbt.com',
          username: 'tempuser',
          avatar: 'DM',
        }),
        isFirstLogin: false,
      };
      
      setUser(updatedUser);
      setPendingTempUser(null);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Password update failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-outline-variant bg-surface-container-lowest">
        {/* Header Alert */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface">First Login Action Required</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            You are logged in with temporary credentials. For security compliance, please set up a permanent password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-600 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Temporary Password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Temporary Password
            </label>
            <div className="relative">
              <input
                type={showTemp ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter temporary password (e.g. temp123)"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowTemp(!showTemp)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                title={showTemp ? 'Hide password' : 'Show password'}
              >
                {showTemp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              New Permanent Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                title={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Confirm Permanent Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                title={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Strength Rules */}
          <PasswordStrengthIndicator password={newPassword} />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 mt-2 text-sm font-semibold shadow-md"
            disabled={loading || !tempPassword || !newPassword || newPassword !== confirmPassword}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Updating Credentials...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Save Password & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/admin');
        }}
        title="Account Setup Complete"
        icon={CheckCircle2}
        iconBg="bg-emerald-100 text-emerald-600"
        footer={
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/admin');
            }}
            variant="primary"
            className="w-full"
          >
            Proceed to Dashboard
          </Button>
        }
      >
        <p className="text-sm text-on-surface-variant">
          Your permanent password has been saved successfully. You may now access your dashboard.
        </p>
      </Modal>
    </>
  );
}
