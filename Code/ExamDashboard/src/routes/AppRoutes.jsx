import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ExamLayout } from '../layouts/ExamLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { ExamLoginPage } from '../pages/auth/ExamLoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { FirstLoginPasswordChangePage } from '../pages/auth/FirstLoginPasswordChangePage';

import { CandidateExamPortalPage } from '../pages/CandidateExamPortalPage';
import { InvigilatorDashboardPage } from '../pages/InvigilatorDashboardPage';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, examStatus, sessionStatus } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/exam/login" replace />;
  }

  if (allowedRole === 'Candidate' && !examStatus.hasActiveExam) {
    return (
      <div className="h-screen w-screen bg-background text-on-surface flex flex-col items-center justify-center p-8 space-y-6">
        <AlertCircle className="w-20 h-20 text-amber-500" />
        <h1 className="text-3xl font-black">Access Restricted</h1>
        <p className="text-sm text-on-surface-variant text-center max-w-md font-semibold">
          No active or scheduled examination is currently available for your account. Please contact the examination administration.
        </p>
      </div>
    );
  }

  if (allowedRole === 'Invigilator' && !sessionStatus.hasActiveSession) {
    return (
      <div className="h-screen w-screen bg-background text-on-surface flex flex-col items-center justify-center p-8 space-y-6">
        <AlertCircle className="w-20 h-20 text-amber-500" />
        <h1 className="text-3xl font-black">Access Restricted</h1>
        <p className="text-sm text-on-surface-variant text-center max-w-md font-semibold">
          No active examination sessions are currently assigned to you. Please contact the administration.
        </p>
      </div>
    );
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirects to exam login */}
      <Route path="/" element={<Navigate to="/exam/login" replace />} />

      {/* Examination Login */}
      <Route path="/exam/login" element={<AuthLayout />}>
        <Route index element={<ExamLoginPage />} />
      </Route>

      {/* Common Auth Utilities (Password recovery / First login) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/exam/login" replace />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="otp-verification" element={<OtpVerificationPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="first-login-change" element={<FirstLoginPasswordChangePage />} />
      </Route>

      {/* Legacy Login Redirect */}
      <Route path="/login" element={<Navigate to="/exam/login" replace />} />

      {/* Examination Portal Routes */}
      <Route path="/exam" element={<ExamLayout />}>
        <Route index element={<Navigate to="/exam/login" replace />} />
        <Route
          path="candidate"
          element={
            <ProtectedRoute allowedRole="Candidate">
              <CandidateExamPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="invigilator"
          element={
            <ProtectedRoute allowedRole="Invigilator">
              <InvigilatorDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/exam/login" replace />} />
    </Routes>
  );
}
