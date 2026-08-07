// Mock Sessions Management Service for Nexis CBT Platform

export const MOCK_INVIGILATORS = [
  { id: 'INV-001', name: 'Marcus Vance', email: 'invigilator@nexiscbt.com', status: 'Available', activeSessionsCount: 1, phone: '+1 (555) 234-9900' },
  { id: 'INV-002', name: 'Dr. Sarah Jenkins', email: 'sarah.j@nexiscbt.com', status: 'Assigned', activeSessionsCount: 2, phone: '+1 (555) 345-8811' },
  { id: 'INV-003', name: 'Robert Chen', email: 'robert.c@nexiscbt.com', status: 'Available', activeSessionsCount: 0, phone: '+1 (555) 456-7722' },
  { id: 'INV-004', name: 'Elena Rostova', email: 'elena.r@nexiscbt.com', status: 'Conflict', activeSessionsCount: 3, phone: '+1 (555) 567-6633' },
  { id: 'INV-005', name: 'James Wilson', email: 'james.w@nexiscbt.com', status: 'Available', activeSessionsCount: 0, phone: '+1 (555) 678-5544' }
];

export const INITIAL_SESSIONS = [
  {
    code: 'SES-2026-01',
    examName: 'NEET UG Physics Mock - Slot 01',
    center: 'Main Campus Assessment Center',
    room: 'Hall A',
    date: '2026-08-15',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    durationMinutes: 180,
    capacity: 120,
    assignedStudentsCount: 110,
    assignedInvigilator: 'Marcus Vance',
    status: 'Active',
    ipSubnet: '192.168.10.0/24',
    roster: [
      { id: 'STU-2026-0891', name: 'Alex Chen', seatNo: 'A-01', terminalId: 'TERM-A-01', verificationStatus: 'Verified', attendanceStatus: 'Present' },
      { id: 'STU-2026-0892', name: 'Sophia Martinez', seatNo: 'A-02', terminalId: 'TERM-A-02', verificationStatus: 'Verified', attendanceStatus: 'Present' },
      { id: 'STU-2026-0893', name: 'Marcus Vance Jr.', seatNo: 'A-03', terminalId: 'TERM-A-03', verificationStatus: 'Pending', attendanceStatus: 'Present' },
      { id: 'STU-2026-0894', name: 'Emily Watson', seatNo: 'A-04', terminalId: 'TERM-A-04', verificationStatus: 'Verified', attendanceStatus: 'Present' },
      { id: 'STU-2026-0895', name: 'David Miller', seatNo: 'A-05', terminalId: 'TERM-A-05', verificationStatus: 'Pending', attendanceStatus: 'Absent' },
      { id: 'STU-2026-0896', name: 'Aisha Patel', seatNo: 'A-06', terminalId: 'TERM-A-06', verificationStatus: 'Verified', attendanceStatus: 'Present' },
      { id: 'STU-2026-0897', name: 'Liam O\'Connor', seatNo: 'A-07', terminalId: 'TERM-A-07', verificationStatus: 'Rejected', attendanceStatus: 'Absent' },
      { id: 'STU-2026-0898', name: 'Zoe Kim', seatNo: 'A-08', terminalId: 'TERM-A-08', verificationStatus: 'Verified', attendanceStatus: 'Present' }
    ],
    timeline: [
      { event: 'Session Created & Scheduled', time: '2026-08-01 08:00 AM', user: 'Admin System' },
      { event: 'Invigilator Marcus Vance Assigned', time: '2026-08-02 09:30 AM', user: 'Dr. Sarah Jenkins' },
      { event: 'Student Roster Locked (110 Candidates)', time: '2026-08-14 18:00 PM', user: 'Admin System' },
      { event: 'Session Live Supervision Started', time: '2026-08-15 08:50 AM', user: 'Marcus Vance' }
    ]
  },
  {
    code: 'SES-2026-02',
    examName: 'NEET UG Chemistry Prep - Slot 02',
    center: 'North Wing Testing Facility',
    room: 'Room 302',
    date: '2026-08-15',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    durationMinutes: 180,
    capacity: 45,
    assignedStudentsCount: 42,
    assignedInvigilator: 'Dr. Sarah Jenkins',
    status: 'Active',
    ipSubnet: '192.168.12.0/24',
    roster: [
      { id: 'STU-2026-0893', name: 'Marcus Vance Jr.', seatNo: 'B-01', terminalId: 'TERM-B-01', verificationStatus: 'Pending', attendanceStatus: 'Present' },
      { id: 'STU-2026-0897', name: 'Liam O\'Connor', seatNo: 'B-02', terminalId: 'TERM-B-02', verificationStatus: 'Rejected', attendanceStatus: 'Absent' }
    ],
    timeline: [
      { event: 'Session Created', time: '2026-08-03 10:00 AM', user: 'Admin System' },
      { event: 'Invigilator Dr. Sarah Jenkins Assigned', time: '2026-08-04 11:00 AM', user: 'Admin System' }
    ]
  },
  {
    code: 'SES-2026-03',
    examName: 'NEET UG Botany Diagnostic - Slot 01',
    center: 'AI Innovation Hub',
    room: 'Lab 4',
    date: '2026-08-16',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    durationMinutes: 180,
    capacity: 60,
    assignedStudentsCount: 58,
    assignedInvigilator: 'Robert Chen',
    status: 'Scheduled',
    ipSubnet: '192.168.15.0/24',
    roster: [
      { id: 'STU-2026-0894', name: 'Emily Watson', seatNo: 'C-01', terminalId: 'TERM-C-01', verificationStatus: 'Verified', attendanceStatus: 'Scheduled' },
      { id: 'STU-2026-0898', name: 'Zoe Kim', seatNo: 'C-02', terminalId: 'TERM-C-02', verificationStatus: 'Verified', attendanceStatus: 'Scheduled' }
    ],
    timeline: [
      { event: 'Session Created & Scheduled', time: '2026-08-05 14:00 PM', user: 'Admin System' }
    ]
  },
  {
    code: 'SES-2026-04',
    examName: 'NEET UG Physics Practice - Slot 03',
    center: 'Main Campus Assessment Center',
    room: 'Auditorium 1',
    date: '2026-08-18',
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    durationMinutes: 150,
    capacity: 250,
    assignedStudentsCount: 240,
    assignedInvigilator: 'James Wilson',
    status: 'Scheduled',
    ipSubnet: '192.168.20.0/24',
    roster: [],
    timeline: []
  },
  {
    code: 'SES-2026-05',
    examName: 'NEET UG Zoology Mock - Slot 02',
    center: 'Science Complex',
    room: 'Room 105',
    date: '2026-08-10',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    durationMinutes: 180,
    capacity: 50,
    assignedStudentsCount: 48,
    assignedInvigilator: 'Marcus Vance',
    status: 'Completed',
    ipSubnet: '192.168.22.0/24',
    roster: [],
    timeline: []
  }
];

export const MOCK_CENTERS = [
  'Main Campus Assessment Center',
  'North Wing Testing Facility',
  'AI Innovation Hub',
  'Science Complex'
];

export const MOCK_ROOMS = [
  'Hall A',
  'Room 302',
  'Lab 4',
  'Auditorium 1',
  'Room 105'
];
