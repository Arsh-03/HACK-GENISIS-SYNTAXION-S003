import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../shared/components/ui/Card';
import { Input } from '../../shared/components/ui/Input';
import { Button } from '../../shared/components/ui/Button';
import { mockAuthService } from '../../services/mockAuth';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { setPendingOtpEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await mockAuthService.sendOtp(identifier);
      setPendingOtpEmail(identifier);
      setSuccess(true);
      setSuccessMessage(res.message || `Verification OTP dispatched to ${identifier}`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-outline-variant bg-surface-container-lowest">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">Forgot Password?</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Enter your registered email or username to receive a 6-digit OTP code.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-600 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      {success ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-center">
            <div className="inline-flex p-2 bg-emerald-500 text-white rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-emerald-800">OTP Sent Successfully!</div>
            <div className="text-xs text-emerald-700 leading-relaxed">
              {successMessage}
            </div>
            <div className="text-[11px] font-mono bg-emerald-100/70 p-1.5 rounded text-emerald-900">
              Demo Code: <span className="font-bold tracking-widest">123456</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/auth/otp-verification')}
            variant="primary"
            className="w-full py-2.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2"
          >
            <span>Proceed to Verification</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            type="text"
            placeholder="e.g. admin@nexiscbt.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 text-sm font-semibold shadow-md"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Sending OTP...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Send Verification OTP</span>
              </div>
            )}
          </Button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-outline-variant text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </Card>
  );
}
