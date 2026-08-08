import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExamStatus, fetchSessions } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [pendingOtpEmail, setPendingOtpEmail] = useState('');
  const [pendingTempUser, setPendingTempUser] = useState(null);
  const [examStatus, setExamStatus] = useState({ hasActiveExam: false, examId: null, sessionId: null });
  const [sessionStatus, setSessionStatus] = useState({ hasActiveSession: false });
  const navigate = useNavigate();

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData?.role) {
      setSelectedRole(userData.role);
    }
  };

  const checkPermissions = async (userId, role) => {
    if (role === 'Candidate' || role === 'STUDENT') {
      try {
        const statusRes = await fetch(`http://localhost:5001/api/exam/status/${encodeURIComponent(userId)}`).then(r => r.json());
        if (statusRes.hasActiveExam) {
          setExamStatus(statusRes);
          return true;
        }

        const examsRes = await fetch('http://localhost:5001/api/exams').then(r => r.json());
        const exams = Array.isArray(examsRes) ? examsRes : [];
        const hasAvailableExam = exams.some(e => e.status === 'PUBLISHED' || e.status === 'ACTIVE' || e.status === 'UPCOMING');
        if (hasAvailableExam) {
          setExamStatus({ hasActiveExam: true, examId: exams[0]._id, sessionId: null });
          return true;
        }

        setExamStatus({ hasActiveExam: false });
        return false;
      } catch (e) {
        console.error('Failed to check exam status:', e);
        return false;
      }
    } else if (role === 'Invigilator' || role === 'INVIGILATOR') {
      try {
        const sessions = await fetchSessions();
        const hasActive = sessions.some(s => s.status === 'active' || s.status === 'RUNNING');
        setSessionStatus({ hasActiveSession: hasActive });
        return hasActive;
      } catch (e) {
        console.error('Failed to check session status:', e);
        return false;
      }
    }
    return true;
  };

  const handleSelectRole = async (role) => {
    setSelectedRole(role);
    if (user) {
      setUser({ ...user, role });
    }

    const canProceed = await checkPermissions(user?.id, role);

    if (!canProceed) {
      if (role === 'Candidate' || role === 'STUDENT') {
        alert('No active or scheduled examination is currently available for you. Please contact the examination administration.');
      } else if (role === 'Invigilator' || role === 'INVIGILATOR') {
        alert('No active examination sessions are currently assigned to you. Please contact the administration.');
      }
      return;
    }

    // Navigate based on role selection
    switch (role) {
      case 'Administrator':
        navigate('/admin');
        break;
      case 'Invigilator':
        navigate('/exam/invigilator');
        break;
      case 'Candidate':
        navigate('/exam/candidate');
        break;
      default:
        navigate('/admin');
        break;
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    setPendingTempUser(null);
    setPendingOtpEmail('');
    setExamStatus({ hasActiveExam: false, examId: null, sessionId: null });
    setSessionStatus({ hasActiveSession: false });
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        selectedRole,
        setSelectedRole: handleSelectRole,
        isAuthenticated: !!user,
        pendingOtpEmail,
        setPendingOtpEmail,
        pendingTempUser,
        setPendingTempUser,
        examStatus,
        sessionStatus,
        checkPermissions,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
