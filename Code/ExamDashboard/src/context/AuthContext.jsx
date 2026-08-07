import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [pendingOtpEmail, setPendingOtpEmail] = useState('');
  const [pendingTempUser, setPendingTempUser] = useState(null);
  const navigate = useNavigate();

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData?.role) {
      setSelectedRole(userData.role);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (user) {
      setUser({ ...user, role });
    }
    
    // Navigate based on role selection
    switch (role) {
      case 'Administrator':
        navigate('/admin/dashboard');
        break;
      case 'Invigilator':
        navigate('/exam/invigilator');
        break;
      case 'Candidate':
        navigate('/exam/candidate');
        break;
      default:
        navigate('/admin/dashboard');
        break;
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    setPendingTempUser(null);
    setPendingOtpEmail('');
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
