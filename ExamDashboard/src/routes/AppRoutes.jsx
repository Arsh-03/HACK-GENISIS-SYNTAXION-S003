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
        <Route path="candidate" element={<CandidateExamPortalPage />} />
        <Route path="invigilator" element={<InvigilatorDashboardPage />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/exam/login" replace />} />
    </Routes>
  );
}
