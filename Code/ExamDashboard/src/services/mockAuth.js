// Mock Authentication Service for Nexis CBT Platform

export const MOCK_USERS = [
  {
    id: 'user-001',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@nexiscbt.com',
    username: 'admin',
    password: 'password123',
    role: 'Administrator',
    avatar: 'SJ',
    isFirstLogin: false,
  },
  {
    id: 'user-002',
    name: 'Marcus Vance',
    email: 'invigilator@nexiscbt.com',
    username: 'invigilator',
    password: 'password123',
    role: 'Invigilator',
    avatar: 'MV',
    isFirstLogin: false,
  },
  {
    id: 'user-003',
    name: 'Alex Chen',
    email: 'candidate@nexiscbt.com',
    username: 'candidate',
    password: 'password123',
    role: 'Candidate',
    avatar: 'AC',
    isFirstLogin: false,
  },
  {
    id: 'user-005',
    name: 'Sophia Chen',
    email: 'sophia.chen@university.edu',
    username: 'sophiac',
    password: 'password123',
    role: 'Candidate',
    avatar: 'SC',
    isFirstLogin: false,
  },
  {
    id: 'user-004',
    name: 'David Miller',
    email: 'temp@nexiscbt.com',
    username: 'tempuser',
    password: 'temp123',
    role: null, // Will select after password change
    avatar: 'DM',
    isFirstLogin: true,
  }
];

export const mockAuthService = {
  // Login method
  async login(identifier, password) {
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await res.json();
      
      // Keep legacy structure for the frontend UI components
      return {
        id: data._id,
        name: data.name,
        email: data.email,
        username: data.email,
        role: data.role === 'ADMIN' ? 'Administrator' : (data.role === 'INVIGILATOR' ? 'Invigilator' : 'Candidate'),
        avatar: data.name.substring(0, 2).toUpperCase(),
        isFirstLogin: false,
        token: data.token
      };
    } catch (e) {
      throw e;
    }
  },

  // Send OTP
  async sendOtp(identifier) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!identifier || identifier.trim() === '') {
          reject(new Error('Please enter a valid email address or username.'));
          return;
        }
        resolve({
          success: true,
          message: `OTP verification code dispatched to ${identifier}`,
          mockOtp: '123456'
        });
      }, 800);
    });
  },

  // Verify OTP
  async verifyOtp(otpCode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!otpCode || otpCode.length !== 6) {
          reject(new Error('Please enter a complete 6-digit OTP code.'));
          return;
        }
        // Accepts 123456 or any 6-digit code for testing except 000000
        if (otpCode === '000000') {
          reject(new Error('Invalid or expired OTP code. Please request a new code.'));
          return;
        }
        resolve({
          success: true,
          message: 'OTP verified successfully.'
        });
      }, 600);
    });
  },

  // Reset Password
  async resetPassword(newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!newPassword || newPassword.length < 8) {
          reject(new Error('Password must be at least 8 characters long.'));
          return;
        }
        resolve({
          success: true,
          message: 'Your password has been successfully reset.'
        });
      }, 800);
    });
  },

  // First Login Password Change
  async changeFirstLoginPassword(tempPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (tempPassword === newPassword) {
          reject(new Error('New password cannot be the same as the temporary password.'));
          return;
        }
        if (!newPassword || newPassword.length < 8) {
          reject(new Error('New password must be at least 8 characters long.'));
          return;
        }
        resolve({
          success: true,
          message: 'Temporary password changed successfully. You can now select your role.'
        });
      }, 800);
    });
  }
};
