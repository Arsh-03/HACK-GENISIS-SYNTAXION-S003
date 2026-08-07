import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../shared/components/ui/Card';
import { Input } from '../../shared/components/ui/Input';
import { Button } from '../../shared/components/ui/Button';
import { mockAuthService } from '../../services/mockAuth';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, SlidersHorizontal } from 'lucide-react';

export function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { setUser, setPendingTempUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const userData = await mockAuthService.login(identifier, password);
      
      if (userData.isFirstLogin) {
        setPendingTempUser(userData);
        setSuccessMsg('First login detected. Redirecting to password setup...');
        setTimeout(() => {
          navigate('/auth/first-login-change');
        }, 800);
      } else {
        setUser({ ...userData, role: 'Administrator' });
        setSuccessMsg(`Welcome back, ${userData.name}! Redirecting to Admin Dashboard...`);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = () => {
    setIdentifier('admin@example.com');
    setPassword('password123');
  };

  return (
    <Card className="shadow-xl border-outline-variant bg-surface-container-lowest relative">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Portal Selection</span>
      </Link>

      {/* Header Branding within Card */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">Administrator Portal</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Sign in to access CBT administration & operations workspace
        </p>
      </div>

      {/* Quick Demo Credentials Hint */}
      <div className="mb-5 p-2.5 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-on-surface">Demo Admin User:</span>
          <span className="font-mono text-primary ml-1">admin@example.com / password123</span>
        </div>
        <button
          type="button"
          onClick={setDemoCredentials}
          className="text-[11px] font-bold text-primary hover:underline"
        >
          Auto Fill
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-600 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="font-semibold">{successMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifier (Email / Username) */}
        <div>
          <Input
            label="Username or Admin Email"
            type="text"
            placeholder="Enter your email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Password field with show/hide */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 pr-10 bg-surface-container-lowest border border-outline-variant rounded-md text-sm text-on-surface placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
            />
            <span>Remember Me</span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="font-semibold text-primary hover:underline hover:text-primary-hover"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 mt-2 text-sm font-semibold shadow-md"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>
    </Card>
  );
}
