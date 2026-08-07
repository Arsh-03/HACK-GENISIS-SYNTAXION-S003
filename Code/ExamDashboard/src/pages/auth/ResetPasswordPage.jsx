import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Modal } from '../../shared/components/ui/Modal';
import { PasswordStrengthIndicator } from '../../shared/components/auth/PasswordStrengthIndicator';
import { mockAuthService } from '../../services/mockAuth';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await mockAuthService.resetPassword(newPassword);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-xl border-outline-variant bg-surface-container-lowest">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-on-surface">Reset Password</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Create a strong new password for your account.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-600 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          {/* New Password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={newPassword} />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 mt-2 text-sm font-semibold shadow-md"
            disabled={loading || !newPassword || newPassword !== confirmPassword}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Updating Password...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      </Card>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/auth/login');
        }}
        title="Password Reset Successful"
        icon={CheckCircle2}
        iconBg="bg-emerald-100 text-emerald-600"
        footer={
          <Button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/auth/login');
            }}
            variant="primary"
            className="w-full"
          >
            Proceed to Sign In
          </Button>
        }
      >
        <p className="text-sm text-on-surface-variant">
          Your account password has been updated securely. You can now log in with your new credentials.
        </p>
      </Modal>
    </>
  );
}
