import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { ExamLayout } from '../layouts/ExamLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { LandingPage } from '../pages/LandingPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { ExamLoginPage } from '../pages/auth/ExamLoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { FirstLoginPasswordChangePage } from '../pages/auth/FirstLoginPasswordChangePage';

import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { InvigilatorDashboardPage } from '../pages/InvigilatorDashboardPage';
import { AIPaperPipelinePage } from '../pages/AIPaperPipelinePage';
import { CandidateExamPortalPage } from '../pages/CandidateExamPortalPage';
import { DesignSystemPage } from '../pages/DesignSystemPage';
import { StudentManagementPage } from '../pages/StudentManagementPage';
import { SessionManagementPage } from '../pages/SessionManagementPage';
import { QuestionBankPage } from '../pages/QuestionBankPage';
import { ExamBuilderPage } from '../pages/ExamBuilderPage';
import { ReportsAnalyticsPage } from '../pages/ReportsAnalyticsPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { RolesPermissionsPage } from '../pages/RolesPermissionsPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { ExamCentersPage } from '../pages/ExamCentersPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SystemNotificationsPage } from '../pages/SystemNotificationsPage';
import { HelpSupportPage } from '../pages/HelpSupportPage';
import { PlaceholderPage } from '../shared/components/common/PlaceholderPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Portal 1: Administrator Login */}
      <Route path="/admin/login" element={<AuthLayout />}>
        <Route index element={<AdminLoginPage />} />
      </Route>

      {/* Portal 2: Examination Login */}
      <Route path="/exam/login" element={<AuthLayout />}>
        <Route index element={<ExamLoginPage />} />
      </Route>

      {/* Common Auth Utilities (Password recovery / First login) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/" replace />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="otp-verification" element={<OtpVerificationPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="first-login-change" element={<FirstLoginPasswordChangePage />} />
      </Route>

      {/* Legacy Login Redirect */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Portal 1: Administrator Shell Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* Candidate Management */}
        <Route path="candidates/students" element={<StudentManagementPage />} />
        <Route path="candidates/verification" element={<StudentManagementPage />} />
        <Route path="candidates/import" element={<StudentManagementPage />} />

        {/* Examination */}
        <Route path="examination/sessions" element={<SessionManagementPage />} />
        <Route path="examination/question-bank" element={<QuestionBankPage />} />
        <Route path="examination/builder" element={<ExamBuilderPage />} />
        <Route path="examination/seat-mapping" element={<InvigilatorDashboardPage />} />
        <Route path="centers" element={<ExamCentersPage />} />
        <Route path="examination/centers" element={<ExamCentersPage />} />

        {/* AI Capabilities */}
        <Route path="ai/generation" element={<AIPaperPipelinePage />} />
        <Route path="ai/pipeline" element={<AIPaperPipelinePage />} />
        <Route path="ai/audit" element={<AIPaperPipelinePage />} />

        {/* Proctoring */}
        <Route path="proctoring/live" element={<InvigilatorDashboardPage />} />
        <Route path="proctoring/incidents" element={<InvigilatorDashboardPage />} />

        {/* Reports & Analytics */}
        <Route path="reports/dashboard" element={<ReportsAnalyticsPage initialTab="executive" />} />
        <Route path="reports/attendance" element={<ReportsAnalyticsPage initialTab="attendance" />} />
        <Route path="reports/performance" element={<ReportsAnalyticsPage initialTab="candidate" />} />
        <Route path="reports/violations" element={<ReportsAnalyticsPage initialTab="incident" />} />

        {/* Administration & Settings */}
        <Route path="administration/users" element={<UserManagementPage />} />
        <Route path="administration/roles" element={<RolesPermissionsPage />} />
        <Route path="administration/settings" element={<AdminSettingsPage initialTab="org" />} />
        <Route path="administration/logs" element={<AuditLogsPage />} />
        <Route path="organization" element={<AdminSettingsPage initialTab="org" />} />
        <Route path="settings/security" element={<AdminSettingsPage initialTab="security" />} />
        <Route path="settings/ai" element={<AdminSettingsPage initialTab="ai" />} />
        <Route path="settings/infrastructure" element={<AdminSettingsPage initialTab="infra" />} />

        {/* System */}
        <Route path="system/notifications" element={<SystemNotificationsPage />} />
        <Route path="system/help" element={<HelpSupportPage />} />

        {/* Design System */}
        <Route path="design-system" element={<DesignSystemPage />} />
      </Route>

      {/* Portal 2: Examination Portal Routes */}
      <Route path="/exam" element={<ExamLayout />}>
        <Route index element={<Navigate to="/exam/login" replace />} />
        <Route path="candidate" element={<CandidateExamPortalPage />} />
        <Route path="invigilator" element={<InvigilatorDashboardPage />} />
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
