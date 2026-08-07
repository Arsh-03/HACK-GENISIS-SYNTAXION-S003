import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { mockAuthService } from '../../services/mockAuth';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, RotateCcw, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  const inputRefs = useRef([]);
  const { pendingOtpEmail } = useAuth();
  const navigate = useNavigate();

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    setError('');
    setLoading(true);

    try {
      await mockAuthService.verifyOtp(otpCode);
      navigate('/auth/reset-password');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your 6-digit code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setResendMsg('');
    try {
      await mockAuthService.sendOtp(pendingOtpEmail || 'user@nexiscbt.com');
      setResendMsg('A new 6-digit OTP code has been sent.');
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="shadow-xl border-outline-variant bg-surface-container-lowest">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">OTP Verification</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Enter the 6-digit code sent to{' '}
          <span className="font-semibold text-on-surface font-mono">
            {pendingOtpEmail || 'your registered contact'}
          </span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-600 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      {resendMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-semibold">{resendMsg}</div>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 OTP Input Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono bg-surface-bright border-2 border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
              disabled={loading}
            />
          ))}
        </div>

        {/* Demo Code Helper */}
        <div className="text-center">
          <span className="text-[11px] font-mono text-on-surface-variant bg-surface-bright px-2.5 py-1 rounded border border-outline-variant">
            Demo Test OTP: <span className="font-bold text-primary">123456</span>
          </span>
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 text-sm font-semibold shadow-md"
          disabled={loading || otp.some(d => !d)}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Verifying Code...</span>
            </div>
          ) : (
            <span>Verify OTP Code</span>
          )}
        </Button>
      </form>

      {/* Countdown & Resend Section */}
      <div className="mt-6 pt-4 border-t border-outline-variant flex items-center justify-between text-xs">
        <Link
          to="/auth/forgot-password"
          className="inline-flex items-center gap-1.5 font-medium text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>

        <div>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline hover:text-primary-hover"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resend OTP</span>
            </button>
          ) : (
            <span className="text-on-surface-variant font-mono text-[11px]">
              Resend in <span className="font-bold text-on-surface">{timer}s</span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
