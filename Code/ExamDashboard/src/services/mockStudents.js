// Mock Student Management Service for Nexis CBT Platform

export const INITIAL_STUDENTS = [
  {
    id: 'STU-2026-0891',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    phone: '+1 (555) 234-5678',
    session: 'CS-101 Midterm - Hall A',
    verificationStatus: 'Verified',
    faceMatchScore: 98.4,
    registrationStatus: 'Active',
    avatar: 'AC',
    department: 'Computer Science & AI',
    batchYear: '2026',
    enrollmentNo: 'CS2026-0142',
    gpa: '3.92',
    dob: '2004-05-14',
    address: '452 Campus Drive, Hall 3, Suite 201',
    emergencyContact: 'Elena Chen (Mother) - +1 (555) 987-6543',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-01 09:14 AM', status: 'Passed' },
      { step: 'OCR Text Extracted', time: '2026-08-01 09:15 AM', status: 'Passed' },
      { step: 'Facial Recognition Match', time: '2026-08-01 09:16 AM', status: 'Passed' },
      { step: 'Final Verification Approved', time: '2026-08-01 10:00 AM', status: 'Approved' }
    ],
    activityTimeline: [
      { action: 'Logged in to Candidate Portal', time: '2026-08-05 14:22 PM', ip: '192.168.1.45' },
      { action: 'Completed Practice Test #2', time: '2026-08-04 11:30 AM', ip: '192.168.1.45' },
      { action: 'Password updated', time: '2026-08-01 10:05 AM', ip: '192.168.1.12' }
    ],
    notes: [
      { author: 'Dr. Sarah Jenkins', date: '2026-08-01', text: 'Biometric verification approved. Special accommodation granted for left-handed desk.' }
    ]
  },
  {
    id: 'STU-2026-0892',
    name: 'Sophia Martinez',
    email: 'sophia.m@university.edu',
    phone: '+1 (555) 345-6789',
    session: 'CS-101 Midterm - Hall A',
    verificationStatus: 'Verified',
    faceMatchScore: 96.1,
    registrationStatus: 'Active',
    avatar: 'SM',
    department: 'Software Engineering',
    batchYear: '2026',
    enrollmentNo: 'SE2026-0089',
    gpa: '3.85',
    dob: '2003-11-22',
    address: '108 College Ave, Apt 4B',
    emergencyContact: 'Carlos Martinez (Father) - +1 (555) 876-5432',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-02 10:05 AM', status: 'Passed' },
      { step: 'Facial Recognition Match', time: '2026-08-02 10:06 AM', status: 'Passed' },
      { step: 'Final Verification Approved', time: '2026-08-02 10:30 AM', status: 'Approved' }
    ],
    activityTimeline: [
      { action: 'Logged in to Candidate Portal', time: '2026-08-06 08:15 AM', ip: '192.168.1.88' }
    ],
    notes: [
      { author: 'Admin Proctor', date: '2026-08-02', text: 'Verified student identity against state driver license.' }
    ]
  },
  {
    id: 'STU-2026-0893',
    name: 'Marcus Vance Jr.',
    email: 'marcus.v@university.edu',
    phone: '+1 (555) 456-7890',
    session: 'ENG-204 Final - Room 302',
    verificationStatus: 'Pending',
    faceMatchScore: 72.4,
    registrationStatus: 'Active',
    avatar: 'MV',
    department: 'Electrical Engineering',
    batchYear: '2025',
    enrollmentNo: 'EE2025-0311',
    gpa: '3.41',
    dob: '2003-03-09',
    address: '78 West Quad Dorm, Room 112',
    emergencyContact: 'Marcus Vance Sr. (Father) - +1 (555) 765-4321',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-04 14:10 PM', status: 'Passed' },
      { step: 'Facial Match Flagged (Low Lighting)', time: '2026-08-04 14:11 PM', status: 'Flagged' },
      { step: 'Manual Review Pending', time: '2026-08-04 14:12 PM', status: 'Pending' }
    ],
    activityTimeline: [
      { action: 'Uploaded new ID photo', time: '2026-08-04 14:10 PM', ip: '192.168.2.14' }
    ],
    notes: [
      { author: 'System Sentinel', date: '2026-08-04', text: 'Facial match score 72.4% is below 85% threshold due to lighting glare. Requires manual invigilator sign-off.' }
    ]
  },
  {
    id: 'STU-2026-0894',
    name: 'Emily Watson',
    email: 'emily.w@university.edu',
    phone: '+1 (555) 567-8901',
    session: 'AI-301 Lab Exam - Lab 4',
    verificationStatus: 'Verified',
    faceMatchScore: 99.1,
    registrationStatus: 'Active',
    avatar: 'EW',
    department: 'Data Science & AI',
    batchYear: '2026',
    enrollmentNo: 'DS2026-0045',
    gpa: '3.98',
    dob: '2004-09-30',
    address: '320 University Ave, Apt 12',
    emergencyContact: 'Hannah Watson (Sister) - +1 (555) 654-3210',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-01 08:30 AM', status: 'Passed' },
      { step: 'Facial Recognition Match', time: '2026-08-01 08:31 AM', status: 'Passed' },
      { step: 'Final Verification Approved', time: '2026-08-01 08:45 AM', status: 'Approved' }
    ],
    activityTimeline: [
      { action: 'Logged in to Candidate Portal', time: '2026-08-06 09:40 AM', ip: '192.168.1.101' }
    ],
    notes: []
  },
  {
    id: 'STU-2026-0895',
    name: 'David Miller',
    email: 'temp@nexiscbt.com',
    phone: '+1 (555) 678-9012',
    session: 'Unassigned',
    verificationStatus: 'Pending',
    faceMatchScore: 68.0,
    registrationStatus: 'Active',
    avatar: 'DM',
    department: 'Information Technology',
    batchYear: '2027',
    enrollmentNo: 'IT2027-0104',
    gpa: '3.20',
    dob: '2005-01-18',
    address: '54 East Residence Hall',
    emergencyContact: 'Robert Miller (Father) - +1 (555) 543-2109',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'Temporary Password Issued', time: '2026-08-05 16:00 PM', status: 'Passed' },
      { step: 'Verification Document Pending', time: '2026-08-05 16:01 PM', status: 'Pending' }
    ],
    activityTimeline: [
      { action: 'First time login initiated', time: '2026-08-06 10:12 AM', ip: '192.168.3.11' }
    ],
    notes: [
      { author: 'Admin System', date: '2026-08-05', text: 'First-time user setup. Temporary password requires update.' }
    ]
  },
  {
    id: 'STU-2026-0896',
    name: 'Aisha Patel',
    email: 'aisha.p@university.edu',
    phone: '+1 (555) 789-0123',
    session: 'CS-101 Midterm - Hall A',
    verificationStatus: 'Verified',
    faceMatchScore: 97.8,
    registrationStatus: 'Active',
    avatar: 'AP',
    department: 'Computer Science & AI',
    batchYear: '2026',
    enrollmentNo: 'CS2026-0210',
    gpa: '3.95',
    dob: '2004-07-04',
    address: '89 Innovation Way, Apt 3A',
    emergencyContact: 'Tariq Patel (Father) - +1 (555) 432-1098',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-02 11:20 AM', status: 'Passed' },
      { step: 'Final Verification Approved', time: '2026-08-02 11:40 AM', status: 'Approved' }
    ],
    activityTimeline: [],
    notes: []
  },
  {
    id: 'STU-2026-0897',
    name: 'Liam O\'Connor',
    email: 'liam.o@university.edu',
    phone: '+1 (555) 890-1234',
    session: 'ENG-204 Final - Room 302',
    verificationStatus: 'Rejected',
    faceMatchScore: 45.2,
    registrationStatus: 'Inactive',
    avatar: 'LO',
    department: 'Mechanical Engineering',
    batchYear: '2025',
    enrollmentNo: 'ME2025-0078',
    gpa: '2.90',
    dob: '2003-12-12',
    address: '12 Oak Street, Apt 1',
    emergencyContact: 'Fiona O\'Connor (Mother) - +1 (555) 321-0987',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-03 15:30 PM', status: 'Passed' },
      { step: 'Facial Match Failed (Mismatch)', time: '2026-08-03 15:31 PM', status: 'Failed' },
      { step: 'Verification Rejected', time: '2026-08-03 16:00 PM', status: 'Rejected' }
    ],
    activityTimeline: [],
    notes: [
      { author: 'Security Sentinel', date: '2026-08-03', text: 'Facial photo mismatch against ID photo. Account placed on hold pending identity re-submission.' }
    ]
  },
  {
    id: 'STU-2026-0898',
    name: 'Zoe Kim',
    email: 'zoe.kim@university.edu',
    phone: '+1 (555) 901-2345',
    session: 'AI-301 Lab Exam - Lab 4',
    verificationStatus: 'Verified',
    faceMatchScore: 99.5,
    registrationStatus: 'Active',
    avatar: 'ZK',
    department: 'Artificial Intelligence',
    batchYear: '2026',
    enrollmentNo: 'AI2026-0012',
    gpa: '4.00',
    dob: '2004-02-28',
    address: '404 Science Park Towers',
    emergencyContact: 'Jin Kim (Father) - +1 (555) 210-9876',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    idCardUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    verificationTimeline: [
      { step: 'ID Card Uploaded', time: '2026-08-01 07:45 AM', status: 'Passed' },
      { step: 'Final Verification Approved', time: '2026-08-01 08:00 AM', status: 'Approved' }
    ],
    activityTimeline: [],
    notes: []
  }
];

export const MOCK_EXAM_SESSIONS = [
  'CS-101 Midterm - Hall A',
  'ENG-204 Final - Room 302',
  'AI-301 Lab Exam - Lab 4',
  'MATH-201 Calculus - Auditorium 1',
  'PHY-102 Physics Lab - Room 105',
  'Unassigned'
];
