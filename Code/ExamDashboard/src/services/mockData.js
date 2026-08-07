export const mockExamSections = [
  {
    id: "sec-1",
    title: "Section 1: Core Concepts",
    shortName: "Core Concepts",
    subject: "Computer Science 101",
    questions: [
      {
        id: "q-1",
        number: 1,
        type: "Single Choice Question",
        points: 2,
        status: "answered", // 'answered', 'marked', 'unanswered', 'not-visited'
        selectedOption: "A",
        text: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
        codeSnippet: null,
        options: [
          { id: "A", text: "Stack" },
          { id: "B", text: "Queue" },
          { id: "C", text: "Binary Tree" },
          { id: "D", text: "Linked List" }
        ]
      },
      {
        id: "q-2",
        number: 2,
        type: "Single Choice Question",
        points: 2,
        status: "answered",
        selectedOption: "B",
        text: "What is the worst-case time complexity of QuickSort without median-of-three optimization?",
        codeSnippet: null,
        options: [
          { id: "A", text: "O(n log n)" },
          { id: "B", text: "O(n²)" },
          { id: "C", text: "O(n)" },
          { id: "D", text: "O(log n)" }
        ]
      },
      {
        id: "q-16",
        number: 16,
        type: "Single Choice Question",
        points: 2,
        status: "marked",
        selectedOption: "C",
        text: "Consider the following binary search tree implementation. What is the time complexity of searching for an element in the worst-case scenario, assuming the tree is not self-balancing?",
        codeSnippet: `class Node {
    int key;
    Node left, right;
    public Node(int item) {
        key = item; left = right = null;
    }
}
// Search function omitted for brevity`,
        options: [
          { id: "A", text: "O(1)" },
          { id: "B", text: "O(log n)" },
          { id: "C", text: "O(n)" },
          { id: "D", text: "O(n log n)" }
        ]
      }
    ]
  },
  {
    id: "sec-2",
    title: "Section 2: Data Structures",
    shortName: "Data Structures",
    subject: "Computer Science 101",
    questions: [
      {
        id: "q-21",
        number: 21,
        type: "Single Choice Question",
        points: 3,
        status: "not-visited",
        selectedOption: null,
        text: "Which tree traversal strategy visits the root node before visiting its subtrees?",
        codeSnippet: null,
        options: [
          { id: "A", text: "In-order" },
          { id: "B", text: "Pre-order" },
          { id: "C", text: "Post-order" },
          { id: "D", text: "Level-order" }
        ]
      }
    ]
  },
  {
    id: "sec-3",
    title: "Section 3: Algorithms",
    shortName: "Algorithms",
    subject: "Computer Science 101",
    questions: [
      {
        id: "q-35",
        number: 35,
        type: "Single Choice Question",
        points: 4,
        status: "not-visited",
        selectedOption: null,
        text: "Dijkstra's Algorithm cannot correctly handle graphs containing which of the following?",
        codeSnippet: null,
        options: [
          { id: "A", text: "Cycle paths" },
          { id: "B", text: "Negative edge weights" },
          { id: "C", text: "Unweighted edges" },
          { id: "D", text: "Self-loop vertices" }
        ]
      }
    ]
  }
];

export const mockCandidates = [
  {
    id: "cand-1",
    name: "Aarav Sharma",
    candidateId: "CBT-2026-0891",
    terminalId: "TRM-04-12",
    seat: "Lab 04 - Station 12",
    status: "CRITICAL", // 'NORMAL', 'WARNING', 'CRITICAL', 'OFFLINE'
    violationType: "Multiple Faces Detected",
    riskScore: 94,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "CONNECTED", // 'CONNECTED', 'LAGGING', 'DISCONNECTED'
    heartbeatStatus: "1s ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "98.4%",
    examProgress: 68,
    answeredCount: 34,
    totalQuestions: 50,
    email: "aarav.sharma@university.edu",
    department: "Computer Science & Engineering",
    batch: "2022-2026",
    avatarBg: "bg-red-500",
    snapshotUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    activityTimeline: [
      { time: "10:42:15 AM", type: "CRITICAL", text: "Second person detected in webcam stream." },
      { time: "10:35:01 AM", type: "WARNING", text: "Window unfocus / Alt-Tab event registered." },
      { time: "09:00:10 AM", type: "INFO", text: "Biometric face verification passed (98.4% match)." }
    ]
  },
  {
    id: "cand-2",
    name: "Sophia Chen",
    candidateId: "CBT-2026-0412",
    terminalId: "TRM-02-05",
    seat: "Lab 02 - Station 05",
    status: "WARNING",
    violationType: "Frequent Gaze Deviation",
    riskScore: 68,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "CONNECTED",
    heartbeatStatus: "2s ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "96.2%",
    examProgress: 82,
    answeredCount: 41,
    totalQuestions: 50,
    email: "sophia.chen@university.edu",
    department: "Electrical Engineering",
    batch: "2022-2026",
    avatarBg: "bg-amber-500",
    snapshotUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    activityTimeline: [
      { time: "10:41:50 AM", type: "WARNING", text: "Gaze off-screen for > 8 consecutive seconds." },
      { time: "09:02:00 AM", type: "INFO", text: "Exam session started." }
    ]
  },
  {
    id: "cand-3",
    name: "Marcus Vance",
    candidateId: "CBT-2026-1029",
    terminalId: "TRM-01-22",
    seat: "Lab 01 - Station 22",
    status: "NORMAL",
    violationType: "None",
    riskScore: 4,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "CONNECTED",
    heartbeatStatus: "1s ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "99.1%",
    examProgress: 90,
    answeredCount: 45,
    totalQuestions: 50,
    email: "marcus.vance@university.edu",
    department: "Mechanical Engineering",
    batch: "2023-2027",
    avatarBg: "bg-emerald-500",
    snapshotUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    activityTimeline: [
      { time: "09:00:00 AM", type: "INFO", text: "Biometric facial authentication cleared." }
    ]
  },
  {
    id: "cand-4",
    name: "Elena Rostova",
    candidateId: "CBT-2026-0773",
    terminalId: "TRM-04-18",
    seat: "Lab 04 - Station 18",
    status: "WARNING",
    violationType: "Audio Anomaly (Voice Detected)",
    riskScore: 61,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "LAGGING",
    heartbeatStatus: "4s ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "94.8%",
    examProgress: 54,
    answeredCount: 27,
    totalQuestions: 50,
    email: "elena.rostova@university.edu",
    department: "Information Technology",
    batch: "2022-2026",
    avatarBg: "bg-amber-500",
    snapshotUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    activityTimeline: [
      { time: "10:39:12 AM", type: "WARNING", text: "Secondary audio frequency signature detected." }
    ]
  },
  {
    id: "cand-5",
    name: "Devon Taylor",
    candidateId: "CBT-2026-1184",
    terminalId: "TRM-03-09",
    seat: "Lab 03 - Station 09",
    status: "NORMAL",
    violationType: "None",
    riskScore: 12,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "CONNECTED",
    heartbeatStatus: "1s ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "97.5%",
    examProgress: 76,
    answeredCount: 38,
    totalQuestions: 50,
    email: "devon.taylor@university.edu",
    department: "Civil Engineering",
    batch: "2023-2027",
    avatarBg: "bg-emerald-500",
    snapshotUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    activityTimeline: []
  },
  {
    id: "cand-6",
    name: "Priya Patel",
    candidateId: "CBT-2026-0920",
    terminalId: "TRM-02-14",
    seat: "Lab 02 - Station 14",
    status: "NORMAL",
    violationType: "None",
    riskScore: 8,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "CONNECTED",
    heartbeatStatus: "2s ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "99.4%",
    examProgress: 88,
    answeredCount: 44,
    totalQuestions: 50,
    email: "priya.patel@university.edu",
    department: "Biomedical Engineering",
    batch: "2022-2026",
    avatarBg: "bg-emerald-500",
    snapshotUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    activityTimeline: []
  },
  {
    id: "cand-7",
    name: "Liam O'Connor",
    candidateId: "CBT-2026-0615",
    terminalId: "TRM-01-08",
    seat: "Lab 01 - Station 08",
    status: "CRITICAL",
    violationType: "Camera Feed Terminated",
    riskScore: 98,
    cameraActive: false,
    micActive: true,
    screenShareActive: false,
    internetStatus: "DISCONNECTED",
    heartbeatStatus: "42s ago",
    verificationStatus: "UNVERIFIED",
    faceMatchScore: "81.0%",
    examProgress: 32,
    answeredCount: 16,
    totalQuestions: 50,
    email: "liam.oconnor@university.edu",
    department: "Software Engineering",
    batch: "2023-2027",
    avatarBg: "bg-red-500",
    snapshotUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    activityTimeline: [
      { time: "10:43:00 AM", type: "CRITICAL", text: "Camera video stream disconnected abruptly." }
    ]
  },
  {
    id: "cand-8",
    name: "Amara Nwosu",
    candidateId: "CBT-2026-0331",
    terminalId: "TRM-03-21",
    seat: "Lab 03 - Station 21",
    status: "OFFLINE",
    violationType: "Network Disconnection",
    riskScore: 0,
    cameraActive: false,
    micActive: false,
    screenShareActive: false,
    internetStatus: "DISCONNECTED",
    heartbeatStatus: "2m ago",
    verificationStatus: "VERIFIED",
    faceMatchScore: "98.1%",
    examProgress: 40,
    answeredCount: 20,
    totalQuestions: 50,
    email: "amara.nwosu@university.edu",
    department: "Data Science",
    batch: "2022-2026",
    avatarBg: "bg-slate-500",
    snapshotUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80",
    activityTimeline: [
      { time: "10:40:00 AM", type: "WARNING", text: "Terminal connection timed out." }
    ]
  }
];

export const mockProctoringOverviewKPIs = [
  { id: "p-kpi-1", title: "Active Session", value: "Medical Board 2026", change: "Hall A", changeType: "neutral", description: "Slot #02 Active", icon: "Clock", iconBg: "bg-indigo-100 text-indigo-700" },
  { id: "p-kpi-2", title: "Candidates Present", value: "450 / 460", change: "97.8%", changeType: "increase", description: "10 absentees", icon: "Users", iconBg: "bg-blue-100 text-blue-700" },
  { id: "p-kpi-3", title: "Candidates Verified", value: "442", change: "98.2%", changeType: "increase", description: "Biometrics clear", icon: "CheckCircle", iconBg: "bg-emerald-100 text-emerald-700" },
  { id: "p-kpi-4", title: "Candidates Flagged", value: "18", change: "4.0%", changeType: "decrease", description: "Requires review", icon: "AlertTriangle", iconBg: "bg-amber-100 text-amber-700" },
  { id: "p-kpi-5", title: "Active Alerts", value: "5", change: "Critical", changeType: "decrease", description: "Unresolved queue", icon: "ShieldAlert", iconBg: "bg-red-100 text-red-700" },
  { id: "p-kpi-6", title: "Incidents Today", value: "12", change: "8 Resolved", changeType: "increase", description: "Audit trail log", icon: "Activity", iconBg: "bg-purple-100 text-purple-700" }
];

export const mockExamHallSeats = [
  { deskNumber: "Desk 01", seatId: "S-101", terminalId: "TRM-01-01", candidateName: "Aarav Sharma", candidateId: "CBT-2026-0891", status: "CRITICAL" },
  { deskNumber: "Desk 02", seatId: "S-102", terminalId: "TRM-01-02", candidateName: "Sophia Chen", candidateId: "CBT-2026-0412", status: "WARNING" },
  { deskNumber: "Desk 03", seatId: "S-103", terminalId: "TRM-01-03", candidateName: "Marcus Vance", candidateId: "CBT-2026-1029", status: "NORMAL" },
  { deskNumber: "Desk 04", seatId: "S-104", terminalId: "TRM-01-04", candidateName: "Elena Rostova", candidateId: "CBT-2026-0773", status: "WARNING" },
  { deskNumber: "Desk 05", seatId: "S-105", terminalId: "TRM-01-05", candidateName: "Devon Taylor", candidateId: "CBT-2026-1184", status: "NORMAL" },
  { deskNumber: "Desk 06", seatId: "S-106", terminalId: "TRM-01-06", candidateName: "Priya Patel", candidateId: "CBT-2026-0920", status: "NORMAL" },
  { deskNumber: "Desk 07", seatId: "S-107", terminalId: "TRM-01-07", candidateName: "Liam O'Connor", candidateId: "CBT-2026-0615", status: "CRITICAL" },
  { deskNumber: "Desk 08", seatId: "S-108", terminalId: "TRM-01-08", candidateName: "Amara Nwosu", candidateId: "CBT-2026-0331", status: "OFFLINE" },
  { deskNumber: "Desk 09", seatId: "S-109", terminalId: "TRM-01-09", candidateName: "Rohan Gupta", candidateId: "CBT-2026-0112", status: "NORMAL" },
  { deskNumber: "Desk 10", seatId: "S-110", terminalId: "TRM-01-10", candidateName: "Hannah Abbott", candidateId: "CBT-2026-0524", status: "NORMAL" },
  { deskNumber: "Desk 11", seatId: "S-111", terminalId: "TRM-01-11", candidateName: "Mateo Silva", candidateId: "CBT-2026-0811", status: "WARNING" },
  { deskNumber: "Desk 12", seatId: "S-112", terminalId: "TRM-01-12", candidateName: "Zoe Miller", candidateId: "CBT-2026-0933", status: "NORMAL" },
  { deskNumber: "Desk 13", seatId: "S-113", terminalId: "TRM-02-01", candidateName: "Karan Singh", candidateId: "CBT-2026-0441", status: "NORMAL" },
  { deskNumber: "Desk 14", seatId: "S-114", terminalId: "TRM-02-02", candidateName: "Yuki Tanaka", candidateId: "CBT-2026-0719", status: "NORMAL" },
  { deskNumber: "Desk 15", seatId: "S-115", terminalId: "TRM-02-03", candidateName: "Gabriel Santos", candidateId: "CBT-2026-0888", status: "CRITICAL" },
  { deskNumber: "Desk 16", seatId: "S-116", terminalId: "TRM-02-04", candidateName: "Olivia Wright", candidateId: "CBT-2026-0155", status: "NORMAL" },
  { deskNumber: "Desk 17", seatId: "S-117", terminalId: "TRM-02-05", candidateName: "Noah Kim", candidateId: "CBT-2026-0299", status: "NORMAL" },
  { deskNumber: "Desk 18", seatId: "S-118", terminalId: "TRM-02-06", candidateName: "Isabella Rossi", candidateId: "CBT-2026-0644", status: "WARNING" },
  { deskNumber: "Desk 19", seatId: "S-119", terminalId: "TRM-02-07", candidateName: "Ethan Hunt", candidateId: "CBT-2026-0377", status: "NORMAL" },
  { deskNumber: "Desk 20", seatId: "S-120", terminalId: "TRM-02-08", candidateName: "Chloe Bennett", candidateId: "CBT-2026-0599", status: "OFFLINE" },
  { deskNumber: "Desk 21", seatId: "S-121", terminalId: "TRM-03-01", candidateName: "Lucas Alvares", candidateId: "CBT-2026-0833", status: "NORMAL" },
  { deskNumber: "Desk 22", seatId: "S-122", terminalId: "TRM-03-02", candidateName: "Mia Fischer", candidateId: "CBT-2026-0977", status: "NORMAL" },
  { deskNumber: "Desk 23", seatId: "S-123", terminalId: "TRM-03-03", candidateName: "Alexander Bell", candidateId: "CBT-2026-0120", status: "NORMAL" },
  { deskNumber: "Desk 24", seatId: "S-124", terminalId: "TRM-03-04", candidateName: "Nora Lindqvist", candidateId: "CBT-2026-0488", status: "NORMAL" }
];

export const mockLiveAlerts = [
  { id: "alt-1", category: "Multiple Faces", severity: "CRITICAL", timestamp: "10:42:15 AM", student: "Aarav Sharma", candidateId: "CBT-2026-0891", terminalId: "TRM-04-12", recommendedAction: "Issue Immediate Warning & Inspect Stream" },
  { id: "alt-2", category: "Camera Disabled", severity: "CRITICAL", timestamp: "10:43:00 AM", student: "Liam O'Connor", candidateId: "CBT-2026-0615", terminalId: "TRM-01-08", recommendedAction: "Dispatch On-Site Invigilator to Desk 07" },
  { id: "alt-3", category: "High Background Noise", severity: "WARNING", timestamp: "10:39:12 AM", student: "Elena Rostova", candidateId: "CBT-2026-0773", terminalId: "TRM-04-18", recommendedAction: "Mute Candidate Mic & Request Quiet" },
  { id: "alt-4", category: "Tab Switching", severity: "WARNING", timestamp: "10:41:50 AM", student: "Sophia Chen", candidateId: "CBT-2026-0412", terminalId: "TRM-02-05", recommendedAction: "Send Warning Banner & Lock Browser" },
  { id: "alt-5", category: "Face Not Detected", severity: "WARNING", timestamp: "10:38:00 AM", student: "Mateo Silva", candidateId: "CBT-2026-0811", terminalId: "TRM-01-11", recommendedAction: "Prompt Candidate to Adjust Camera Angle" }
];

export const mockIncidents = [
  { id: "inc-101", time: "10:42:15 AM", student: "Aarav Sharma", candidateId: "CBT-2026-0891", alertType: "Multiple Faces Detected", description: "Secondary person identified standing behind candidate chair.", evidence: "Webcam Frame #18420", status: "New", assignedInvigilator: "Dr. H. Vance" },
  { id: "inc-102", time: "10:41:50 AM", student: "Sophia Chen", candidateId: "CBT-2026-0412", alertType: "Tab Switching Violations", description: "Switched browser focus 3 times within 60 seconds.", evidence: "Browser Audit Trail Log", status: "Acknowledged", assignedInvigilator: "Invigilator M. Reed" },
  { id: "inc-103", time: "10:35:01 AM", student: "Gabriel Santos", candidateId: "CBT-2026-0888", alertType: "Unauthorized Device", description: "Bluetooth headset paired signal detected via proctor client.", evidence: "Device Beacon Scan", status: "Escalated", assignedInvigilator: "Chief Invigilator S. Mehta" },
  { id: "inc-104", time: "09:45:20 AM", student: "Rohan Gupta", candidateId: "CBT-2026-0112", alertType: "Biometric Discrepancy", description: "Initial face match 84% below threshold (95%). Verified manually.", evidence: "ID Card OCR vs Camera Match", status: "Resolved", assignedInvigilator: "Admin Proctor" }
];

export const mockProctoringAnalytics = {
  alertDistribution: [
    { label: "Tab Switching", count: 18, percentage: 35, color: "bg-amber-500" },
    { label: "Gaze Deviation", count: 14, percentage: 27, color: "bg-indigo-500" },
    { label: "Multiple Faces", count: 8, percentage: 16, color: "bg-red-500" },
    { label: "Background Audio", count: 7, percentage: 14, color: "bg-purple-500" },
    { label: "Camera Offline", count: 4, percentage: 8, color: "bg-slate-500" }
  ],
  verificationStatus: [
    { label: "Identity Verified", count: 442, percentage: 98, color: "bg-emerald-500" },
    { label: "Pending Verification", count: 6, percentage: 1.3, color: "bg-amber-500" },
    { label: "Flagged Discrepancy", count: 2, percentage: 0.7, color: "bg-red-500" }
  ],
  connectivityStatus: [
    { label: "High Speed (Online)", count: 438, percentage: 97.3, color: "bg-emerald-500" },
    { label: "High Latency (Lagging)", count: 10, percentage: 2.2, color: "bg-amber-500" },
    { label: "Disconnected (Offline)", count: 2, percentage: 0.5, color: "bg-slate-500" }
  ],
  hourlyIncidentTrend: [
    { time: "09:00 AM", incidents: 2 },
    { time: "09:30 AM", incidents: 5 },
    { time: "10:00 AM", incidents: 9 },
    { time: "10:30 AM", incidents: 12 },
    { time: "11:00 AM", incidents: 7 },
    { time: "11:30 AM", incidents: 4 }
  ]
};

export const mockViolationLogs = [
  { id: "log-1", time: "10:42:15 AM", candidate: "Aarav Sharma", type: "CRITICAL", text: "AI Detector: Second person detected in webcam stream." },
  { id: "log-2", time: "10:41:50 AM", candidate: "Sophia Chen", type: "WARNING", text: "Eye Tracking: Candidate looked off-screen for > 8 seconds." },
  { id: "log-3", time: "10:39:12 AM", candidate: "Elena Rostova", type: "WARNING", text: "Acoustic Guard: Secondary voice audio signature detected." },
  { id: "log-4", time: "10:35:01 AM", candidate: "Aarav Sharma", type: "CRITICAL", text: "Window Switch: Alt-Tab or browser unfocus event." }
];


export const mockAIPipelineConfig = {
  subject: "Advanced Database Systems & Distributed Architectures",
  questionCount: 50,
  difficultyDistribution: {
    easy: 20,
    medium: 50,
    hard: 30
  },
  bloomsTaxonomy: {
    remembering: 15,
    understanding: 25,
    applying: 35,
    analyzing: 25
  },
  stages: [
    { id: 1, name: "Question Pool", status: "completed", progress: 100, timeTaken: "0.3s", resultType: "success", detail: "Ingested 12,450 candidate questions from master repository" },
    { id: 2, name: "Blueprint Validation", status: "completed", progress: 100, timeTaken: "0.5s", resultType: "success", detail: "Matched taxonomy schema & Bloom level distribution matrix" },
    { id: 3, name: "Question Selection", status: "completed", progress: 100, timeTaken: "0.8s", resultType: "success", detail: "Selected 50 optimal items based on discrimination index" },
    { id: 4, name: "Difficulty Balancing", status: "completed", progress: 100, timeTaken: "0.4s", resultType: "success", detail: "Calibrated 20% Easy, 50% Medium, 30% Hard ratio" },
    { id: 5, name: "Subject Distribution", status: "completed", progress: 100, timeTaken: "0.6s", resultType: "success", detail: "Verified 100% syllabus sub-domain weight allocation" },
    { id: 6, name: "Duplicate Detection", status: "completed", progress: 100, timeTaken: "1.1s", resultType: "warning", detail: "0 exact duplicates, 1 near-match flagged for stem check" },
    { id: 7, name: "AI Validation", status: "in-progress", progress: 78, timeTaken: "1.4s", resultType: "info", detail: "Hallucination guard scan & distractor validity check running" },
    { id: 8, name: "Paper Generation", status: "pending", progress: 0, timeTaken: "0.0s", resultType: "pending", detail: "Awaiting AI validation completion" },
    { id: 9, name: "Encryption", status: "pending", progress: 0, timeTaken: "0.0s", resultType: "pending", detail: "AES-256 key pairing queued" },
    { id: 10, name: "Redis Cache", status: "pending", progress: 0, timeTaken: "0.0s", resultType: "pending", detail: "High-speed session warming queued" },
    { id: 11, name: "Ready for Exam", status: "pending", progress: 0, timeTaken: "0.0s", resultType: "pending", detail: "Final publication check pending" }
  ]
};

export const mockAIOpsKPIs = [
  { id: "kpi-1", title: "AI Requests Today", value: "14,892", change: "+12.4%", changeType: "increase", description: "vs yesterday", icon: "Bot", iconBg: "bg-indigo-100 text-indigo-700" },
  { id: "kpi-2", title: "Papers Generated", value: "1,248", change: "+8.1%", changeType: "increase", description: "vs last week", icon: "FileText", iconBg: "bg-emerald-100 text-emerald-700" },
  { id: "kpi-3", title: "Papers Pending Review", value: "14", change: "-3", changeType: "decrease", description: "in HITL queue", icon: "Clock", iconBg: "bg-amber-100 text-amber-700" },
  { id: "kpi-4", title: "AI Accuracy", value: "99.4%", change: "+0.2%", changeType: "increase", description: "hallucination free", icon: "CheckCircle", iconBg: "bg-blue-100 text-blue-700" },
  { id: "kpi-5", title: "Average Generation Time", value: "4.2s", change: "-0.6s", changeType: "increase", description: "latency optimized", icon: "Zap", iconBg: "bg-purple-100 text-purple-700" },
  { id: "kpi-6", title: "Validation Success Rate", value: "98.7%", change: "+1.1%", changeType: "increase", description: "zero-defect rate", icon: "Shield", iconBg: "bg-teal-100 text-teal-700" }
];

export const mockAIAuditPanel = {
  duplicateQuestionsFound: "0 Exact / 1 Near-Match (94.2% Similarity Flagged)",
  ambiguousQuestions: "1 Stem Flagged (Item CS-DB-032 requires HITL review)",
  missingTopics: "None (100% Curriculum Syllabus Covered)",
  difficultyBalance: "20% Easy | 50% Medium | 30% Hard (Calibrated)",
  subjectCoverage: "100% (5/5 Sub-domains Satisfied)",
  validationSummary: "49/50 Passed Auto-Validation (1 Flagged for Human Review)",
  overallConfidenceScore: 98.6
};

export const mockAIProviders = [
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    provider: "Google Cloud Vertex AI",
    status: "Online",
    statusColor: "emerald",
    responseTime: "182ms",
    lastRequest: "2s ago",
    healthIndicator: "99.9% Optimal",
    badge: "PRIMARY MODEL",
    isPrimary: true,
    tps: "142 tokens/sec",
    activeJobs: 4
  },
  {
    id: "openai",
    name: "OpenAI GPT-4o",
    provider: "OpenAI Enterprise API",
    status: "Standby",
    statusColor: "amber",
    responseTime: "240ms",
    lastRequest: "14m ago",
    healthIndicator: "Operational",
    badge: "PLACEHOLDER / BACKUP",
    isPrimary: false,
    tps: "98 tokens/sec",
    activeJobs: 0
  },
  {
    id: "local",
    name: "Local Llama 3 70B",
    provider: "On-Premise GPU Cluster (vLLM)",
    status: "Standby",
    statusColor: "slate",
    responseTime: "410ms",
    lastRequest: "1h ago",
    healthIndicator: "Operational",
    badge: "PLACEHOLDER / LOCAL",
    isPrimary: false,
    tps: "65 tokens/sec",
    activeJobs: 0
  }
];

export const mockAISystemStatus = [
  { id: "sys-1", name: "MongoDB", role: "Primary Document Store", status: "Healthy", latency: "12ms", metrics: "4.2 GB / 16 GB memory used", healthScore: "100%", icon: "Database" },
  { id: "sys-2", name: "Redis Cache", role: "Session & Pipeline Cache", status: "Operational", latency: "2ms", metrics: "Hit Ratio 96.4% | Cluster Active", healthScore: "99.9%", icon: "Zap" },
  { id: "sys-3", name: "AI Service", role: "Vertex AI / Orchestrator", status: "Active", latency: "182ms", metrics: "Load 34% | 16 Worker Threads", healthScore: "99.8%", icon: "Cpu" },
  { id: "sys-4", name: "Queue", role: "BullMQ / Task Manager", status: "Healthy", latency: "4ms", metrics: "Throughput 42 jobs/s | 0 Backlog", healthScore: "100%", icon: "Layers" },
  { id: "sys-5", name: "Storage", role: "AWS S3 Encrypted Vault", status: "Operational", latency: "45ms", metrics: "1.2 TB Assets | 100% Availability", healthScore: "100%", icon: "HardDrive" }
];

export const mockAIGenerationHistory = [
  {
    paperId: "PPR-2026-8941",
    title: "Advanced Distributed Systems Final 2026",
    subject: "Computer Science",
    generatedBy: "Gemini 1.5 Pro AI",
    userRole: "System Automated",
    date: "2026-08-06 14:22:10",
    status: "READY",
    generationTime: "4.8s",
    aiConfidence: "99.2%",
    validationResult: "PASSED",
    questionsCount: 50,
    difficultyRatio: "20/50/30"
  },
  {
    paperId: "PPR-2026-8940",
    title: "National Medical Physiology Entrance",
    subject: "Medicine & Surgery",
    generatedBy: "Dr. A. Sharma (AI-Assisted)",
    userRole: "Lead Examiner",
    date: "2026-08-06 13:45:00",
    status: "PENDING_REVIEW",
    generationTime: "5.1s",
    aiConfidence: "96.4%",
    validationResult: "FLAGGED",
    questionsCount: 100,
    difficultyRatio: "15/60/25"
  },
  {
    paperId: "PPR-2026-8939",
    title: "Corporate Financial Risk Certification",
    subject: "Finance & Accounting",
    generatedBy: "Gemini 1.5 Pro AI",
    userRole: "System Automated",
    date: "2026-08-06 11:15:34",
    status: "READY",
    generationTime: "3.9s",
    aiConfidence: "99.8%",
    validationResult: "PASSED",
    questionsCount: 40,
    difficultyRatio: "25/50/25"
  },
  {
    paperId: "PPR-2026-8938",
    title: "Data Structures & Algorithms Midterm",
    subject: "Computer Science",
    generatedBy: "Prof. S. Mehta",
    userRole: "Faculty Chair",
    date: "2026-08-06 09:30:12",
    status: "VERIFIED",
    generationTime: "4.2s",
    aiConfidence: "98.9%",
    validationResult: "PASSED",
    questionsCount: 60,
    difficultyRatio: "20/45/35"
  },
  {
    paperId: "PPR-2026-8937",
    title: "Quantum Mechanics & Thermodynamics",
    subject: "Physics",
    generatedBy: "Gemini 1.5 Pro AI",
    userRole: "System Automated",
    date: "2026-08-05 18:20:45",
    status: "READY",
    generationTime: "4.6s",
    aiConfidence: "97.5%",
    validationResult: "PASSED",
    questionsCount: 45,
    difficultyRatio: "10/50/40"
  },
  {
    paperId: "PPR-2026-8936",
    title: "Cybersecurity & Cryptographic Protocols",
    subject: "Cybersecurity",
    generatedBy: "Admin Operations",
    userRole: "Chief Auditor",
    date: "2026-08-05 15:10:22",
    status: "READY",
    generationTime: "4.0s",
    aiConfidence: "99.5%",
    validationResult: "PASSED",
    questionsCount: 50,
    difficultyRatio: "20/50/30"
  }
];

export const mockAIVisualAnalytics = {
  difficultyDistribution: [
    { label: "Easy", percentage: 20, count: 10, color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Medium", percentage: 50, count: 25, color: "bg-amber-500", text: "text-amber-600" },
    { label: "Hard", percentage: 30, count: 15, color: "bg-red-500", text: "text-red-600" }
  ],
  subjectDistribution: [
    { subject: "Distributed Systems", count: 15, percentage: 30, color: "bg-indigo-600" },
    { subject: "Data Structures", count: 12, percentage: 24, color: "bg-blue-600" },
    { subject: "Database Indexing", count: 10, percentage: 20, color: "bg-teal-600" },
    { subject: "Network Security", count: 8, percentage: 16, color: "bg-purple-600" },
    { subject: "Machine Learning", count: 5, percentage: 10, color: "bg-pink-600" }
  ],
  generationPerformance: [
    { time: "08:00", latency: 4.8, requests: 840 },
    { time: "09:00", latency: 4.5, requests: 1200 },
    { time: "10:00", latency: 4.1, requests: 1850 },
    { time: "11:00", latency: 3.9, requests: 2100 },
    { time: "12:00", latency: 4.3, requests: 1950 },
    { time: "13:00", latency: 4.2, requests: 1700 },
    { time: "14:00", latency: 3.8, requests: 2400 },
    { time: "15:00", latency: 4.0, requests: 2150 },
    { time: "16:00", latency: 4.4, requests: 1600 }
  ]
};

export const mockAILiveLogs = [
  { id: "l-1", time: "14:22:10.102", level: "INFO", source: "QUESTION_POOL", msg: "[Stage 1] Querying master question database. Matched 12,450 candidates." },
  { id: "l-2", time: "14:22:10.420", level: "INFO", source: "BLUEPRINT", msg: "[Stage 2] Parsing Bloom taxonomy rules. Target: 15% Rem, 25% Und, 35% App, 25% Ana." },
  { id: "l-3", time: "14:22:11.200", level: "INFO", source: "SELECTION", msg: "[Stage 3] Calibrating item discrimination coefficients. Selected 50 items." },
  { id: "l-4", time: "14:22:11.640", level: "SUCCESS", source: "BALANCING", msg: "[Stage 4] Difficulty balancing complete: 10 Easy, 25 Medium, 15 Hard items." },
  { id: "l-5", time: "14:22:12.240", level: "INFO", source: "DISTRIBUTION", msg: "[Stage 5] Subject area allocation verified across 5 core topics." },
  { id: "l-6", time: "14:22:13.350", level: "WARN", source: "DUPLICATE_GUARD", msg: "[Stage 6] Stem similarity scan: Item CS-DB-032 has 94.2% match with PPR-2025-012." },
  { id: "l-7", time: "14:22:14.750", level: "RUNNING", source: "AI_VALIDATOR", msg: "[Stage 7] Running Vertex AI Gemini 1.5 Pro hallucination & distractor check (78% complete)..." }
];

export const mockGeneratedPaperQuestions = [
  { id: "gq-1", code: "CS-DB-001", topic: "B+ Tree Indexing", difficulty: "Medium", bloom: "Applying", qualityScore: "98.4%", stem: "In a B+ Tree index of order m=4, what is the maximum number of keys contained in a leaf node?" },
  { id: "gq-2", code: "CS-DB-002", topic: "Raft Consensus", difficulty: "Hard", bloom: "Analyzing", qualityScore: "96.8%", stem: "Evaluate the split-vote mitigation strategy during leader election in the Raft consensus algorithm when term numbers desynchronize." },
  { id: "gq-3", code: "CS-DB-003", topic: "ACID Isolation", difficulty: "Easy", bloom: "Understanding", qualityScore: "99.1%", stem: "Which ANSI SQL isolation level prevents Phantom Reads but allows Non-Repeatable Reads?" },
  { id: "gq-4", code: "CS-DB-004", topic: "CAP Theorem", difficulty: "Medium", bloom: "Understanding", qualityScore: "97.5%", stem: "Analyze network partition scenarios in a Dynamo-style eventual consistency storage engine." },
  { id: "gq-5", code: "CS-DB-005", topic: "Distributed Transactions", difficulty: "Hard", bloom: "Analyzing", qualityScore: "98.9%", stem: "Explain two-phase commit protocol blocking behavior when coordinator node fails during prepare state." }
];

export const mockAdminStats = {
  activeExams: 14,
  totalCandidates: 2840,
  liveProctored: 1250,
  flaggedIncidents: 18,
  systemHealth: "99.98%",
  serverCpuLoad: "32%",
  recentExams: [
    { id: "ex-101", title: "National Medical Entrance Board 2026", candidates: 1200, status: "IN_PROGRESS", duration: "180 Mins", startTime: "09:00 AM" },
    { id: "ex-102", title: "Computer Science Engineering Finals", candidates: 450, status: "IN_PROGRESS", duration: "120 Mins", startTime: "10:00 AM" },
    { id: "ex-103", title: "Corporate Compliance Certification", candidates: 320, status: "COMPLETED", duration: "60 Mins", startTime: "08:00 AM" },
    { id: "ex-104", title: "Financial Risk & Derivatives Exam", candidates: 870, status: "SCHEDULED", duration: "150 Mins", startTime: "02:00 PM" }
  ]
};

export const mockCandidateProfile = {
  name: "Aarav Sharma",
  candidateId: "CBT-2026-0891",
  email: "aarav.sharma@university.edu",
  department: "Computer Science & Engineering",
  batch: "2022-2026",
  seatNumber: "Lab 04 - Station 12",
  terminalId: "TRM-04-12",
  assignedInvigilator: "Dr. H. Vance",
  verificationStatus: "VERIFIED", // 'VERIFIED', 'PENDING'
  profileCompletion: 100,
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  liveFeedUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
};

export const mockTodayExam = {
  id: "ex-today-2026",
  code: "CS-FINAL-2026",
  title: "National Computer Science Engineering Entrance Finals 2026",
  subject: "Computer Science & Distributed Systems",
  durationMinutes: 120,
  totalQuestions: 50,
  totalMarks: 100,
  negativeMarking: "-0.5 marks per wrong answer",
  allowedMaterials: ["Scratch Sheet", "Virtual Scientific Calculator", "On-Screen Formulas"],
  startTime: "10:00 AM IST",
  slot: "Slot #02 - Morning Session",
  status: "READY"
};

export const mockUpcomingExams = [
  { id: "ex-up-1", code: "PHY-301", title: "Quantum Physics & Wave Mechanics", date: "2026-08-12", duration: "90 Mins", marks: 75 },
  { id: "ex-up-2", code: "MATH-402", title: "Linear Algebra & Numerical Methods", date: "2026-08-18", duration: "120 Mins", marks: 100 }
];

export const mockPreviousExamAttempts = [
  { id: "att-1", title: "Database Systems & SQL Optimization", date: "2026-07-15", score: "88 / 100", percentage: "88.0%", rank: "Rank 42", status: "PASSED" },
  { id: "att-2", title: "Data Structures & Algorithms Midterm", date: "2026-06-20", score: "94 / 100", percentage: "94.0%", rank: "Rank 08", status: "PASSED WITH DISTINCTION" }
];

export const mockExamNotifications = [
  { id: "n-1", date: "2026-08-06", title: "Biometric Identity Verification Reminder", text: "Ensure your camera lens is clean and well-lit prior to system readiness check." },
  { id: "n-2", date: "2026-08-05", title: "Anti-Cheat Guard Policy", text: "Tab switching, secondary monitors, or window unfocus events trigger automatic integrity flags." }
];

export const mockSystemReadinessChecks = [
  { id: "chk-1", name: "Webcam Camera Feed", status: "PASSED", detail: "1080p HD Camera Active (Integrated WebCam)", ok: true },
  { id: "chk-2", name: "Microphone Audio Channel", status: "PASSED", detail: "Acoustic Noise Reduction Active (24-bit 48kHz)", ok: true },
  { id: "chk-3", name: "Internet Connectivity & Latency", status: "PASSED", detail: "High-Speed Fibre (45 Mbps Down / 12ms Ping)", ok: true },
  { id: "chk-4", name: "Browser & OS Compatibility", status: "PASSED", detail: "Chrome v126 (CBT Secure Kiosk Engine)", ok: true },
  { id: "chk-5", name: "Screen Resolution & DPI", status: "PASSED", detail: "1920 x 1080 FHD (Compatible Layout)", ok: true },
  { id: "chk-6", name: "Fullscreen Kiosk Lockdown", status: "PASSED", detail: "Secure Lock Environment Active", ok: true }
];

export const mockExamResultData = {
  score: 92,
  totalMarks: 100,
  percentage: "92.0%",
  rank: "Rank 14 / 2,840 Candidates",
  status: "PASSED WITH DISTINCTION",
  percentile: "99.5th Percentile",
  timeTaken: "1h 44m 12s",
  totalQuestions: 50,
  correctCount: 46,
  incorrectCount: 3,
  unattemptedCount: 1,
  subjectBreakdown: [
    { subject: "Distributed Systems & Raft Consensus", score: "28 / 30", percentage: 93 },
    { subject: "Data Structures & Indexing", score: "24 / 25", percentage: 96 },
    { subject: "Database Isolation & CAP Theorem", score: "20 / 20", percentage: 100 },
    { subject: "Cybersecurity Protocols", score: "20 / 25", percentage: 80 }
  ]
};

export const mockExecutiveReportKPIs = {
  totalRegisteredCandidates: "14,250",
  activeSessions: 14,
  completedExaminations: 148,
  aiGeneratedPapers: 42,
  totalInvigilators: 86,
  overallAttendance: "97.8%",
  overallPassPercentage: "89.4%",
  securityIncidents: 18
};

export const mockCandidatePerformanceReports = [
  { id: "cpr-1", name: "Aarav Sharma", regNo: "CBT-2026-0891", session: "Medical Entrance Slot 02", score: 92, maxScore: 100, percentage: "92.0%", rank: "Rank 14 / 2840", timeTaken: "1h 44m", status: "PASSED", resultBadge: "DISTINCTION", department: "Computer Science", subject: "Distributed Systems" },
  { id: "cpr-2", name: "Elena Rostova", regNo: "CBT-2026-0412", session: "Engineering Finals Slot 01", score: 96, maxScore: 100, percentage: "96.0%", rank: "Rank 03 / 2840", timeTaken: "1h 38m", status: "PASSED", resultBadge: "DISTINCTION", department: "Software Engineering", subject: "Algorithms" },
  { id: "cpr-3", name: "Devon Taylor", regNo: "CBT-2026-0158", session: "Civil Engineering Slot 03", score: 74, maxScore: 100, percentage: "74.0%", rank: "Rank 412 / 2840", timeTaken: "1h 55m", status: "PASSED", resultBadge: "FIRST CLASS", department: "Civil Engineering", subject: "Structural Analysis" },
  { id: "cpr-4", name: "Priya Patel", regNo: "CBT-2026-0920", session: "Biomedical Slot 02", score: 88, maxScore: 100, percentage: "88.0%", rank: "Rank 88 / 2840", timeTaken: "1h 48m", status: "PASSED", resultBadge: "DISTINCTION", department: "Biomedical Engineering", subject: "Biomedical Systems" },
  { id: "cpr-5", name: "Liam O'Connor", regNo: "CBT-2026-0615", session: "Engineering Finals Slot 01", score: 42, maxScore: 100, percentage: "42.0%", rank: "Rank 2104 / 2840", timeTaken: "1h 12m", status: "FAILED", resultBadge: "NEEDS RETAKE", department: "Software Engineering", subject: "Computer Architecture" }
];

export const mockSessionAnalyticsReports = [
  { id: "ses-1", title: "National Medical Board Entrance 2026 - Slot 02", capacity: 1500, assigned: 1450, appeared: 1420, avgTime: "1h 42m", successRate: "91.2%", status: "COMPLETED", date: "2026-08-06", invigilator: "Dr. H. Vance" },
  { id: "ses-2", title: "Computer Science Engineering Finals - Slot 01", capacity: 500, assigned: 450, appeared: 442, avgTime: "1h 35m", successRate: "94.6%", status: "IN_PROGRESS", date: "2026-08-06", invigilator: "Prof. S. Gupta" },
  { id: "ses-3", title: "Corporate Compliance Certification - Slot 03", capacity: 400, assigned: 320, appeared: 318, avgTime: "48m", successRate: "98.1%", status: "COMPLETED", date: "2026-08-05", invigilator: "Ms. M. Jenkins" }
];

export const mockAttendanceReportsData = {
  registered: 14250,
  present: 13936,
  absent: 314,
  lateEntry: 42,
  attendancePercentage: "97.8%",
  departmentBreakdown: [
    { department: "Computer Science & Eng", registered: 4500, present: 4440, absent: 60, turnout: "98.6%" },
    { department: "Biomedical & Life Sciences", registered: 3200, present: 3140, absent: 60, turnout: "98.1%" },
    { department: "Software Engineering", registered: 3800, present: 3690, absent: 110, turnout: "97.1%" },
    { department: "Civil & Structural Eng", registered: 2750, present: 2666, absent: 84, turnout: "96.9%" }
  ]
};

export const mockInvigilatorReportsData = [
  { id: "inv-1", name: "Dr. H. Vance", hall: "Lab 04 - Hall A", assignedCandidates: 120, flaggedIncidents: 4, avgResolutionTime: "1.4 mins", rating: "99.2%", status: "ACTIVE" },
  { id: "inv-2", name: "Prof. S. Gupta", hall: "Lab 02 - Hall B", assignedCandidates: 90, flaggedIncidents: 2, avgResolutionTime: "1.8 mins", rating: "98.5%", status: "ACTIVE" },
  { id: "inv-3", name: "Ms. M. Jenkins", hall: "Lab 01 - Hall C", assignedCandidates: 100, flaggedIncidents: 5, avgResolutionTime: "1.1 mins", rating: "99.6%", status: "COMPLETED" }
];

export const mockAIGenerationReportsData = {
  papersGenerated: 42,
  avgGenerationTime: "14.2s",
  validationSuccessRate: "98.4%",
  aiConfidenceScore: "96.8%",
  difficultyDistribution: { easy: "25%", medium: "50%", hard: "25%" },
  providerTelemetry: [
    { provider: "Vertex AI Gemini 1.5 Pro", requests: 1240, avgLatency: "1.2s", reliability: "99.9%" },
    { provider: "Claude 3.5 Sonnet Engine", requests: 860, avgLatency: "1.4s", reliability: "99.8%" },
    { provider: "Azure OpenAI GPT-4o", requests: 620, avgLatency: "1.1s", reliability: "99.7%" }
  ]
};

export const mockSecurityIncidentReportsData = [
  { id: "inc-r-1", type: "Tab Switch Violation", candidate: "Devon Taylor (CBT-2026-0158)", severity: "CRITICAL", timestamp: "10:42:15 AM", terminal: "TRM-04-12", status: "ACKNOWLEDGED", actionTaken: "Candidate Issued Warning" },
  { id: "inc-r-2", type: "Multiple Face Detection", candidate: "Elena Rostova (CBT-2026-0412)", severity: "HIGH", timestamp: "10:38:20 AM", terminal: "TRM-02-04", status: "RESOLVED", actionTaken: "Invigilator Inspected Hall" },
  { id: "inc-r-3", type: "Camera Stream Interrupted", candidate: "Liam O'Connor (CBT-2026-0615)", severity: "CRITICAL", timestamp: "10:43:00 AM", terminal: "TRM-01-08", status: "ESCALATED", actionTaken: "Session Locked by Proctor" }
];

export const mockAuditReportsData = [
  { id: "aud-1", timestamp: "2026-08-06 10:45:12", user: "Admin (Dr. Vance)", action: "Generated PDF Security Audit Report", ip: "192.168.1.104", status: "SUCCESS" },
  { id: "aud-2", timestamp: "2026-08-06 10:30:00", user: "Proctor (Prof. Gupta)", action: "Unlocked Candidate Terminal TRM-02-14", ip: "192.168.1.108", status: "SUCCESS" }
];

export const mockUsersList = [
  { id: "u-1", name: "Dr. Harold Vance", email: "harold.vance@nexiscbt.org", role: "Administrator", category: "Administrators", status: "ACTIVE", lastLogin: "2 mins ago", phone: "+1 (555) 234-5678", department: "Exam Operations" },
  { id: "u-2", name: "Prof. S. Gupta", email: "s.gupta@university.edu", role: "Invigilator", category: "Invigilators", status: "ACTIVE", lastLogin: "14 mins ago", phone: "+1 (555) 345-6789", department: "Computer Science" },
  { id: "u-3", name: "Ms. Maya Jenkins", email: "m.jenkins@nexiscbt.org", role: "Invigilator", category: "Invigilators", status: "ACTIVE", lastLogin: "1 hour ago", phone: "+1 (555) 456-7890", department: "Biomedical Eng" },
  { id: "u-4", name: "Alex Mercer", email: "alex.mercer@nexiscbt.org", role: "Operator", category: "Operators", status: "ACTIVE", lastLogin: "3 hours ago", phone: "+1 (555) 567-8901", department: "IT Support" },
  { id: "u-5", name: "Sarah Connor", email: "sarah.c@nexiscbt.org", role: "Support Staff", category: "Support Staff", status: "INACTIVE", lastLogin: "2 days ago", phone: "+1 (555) 678-9012", department: "Candidate Helpdesk" }
];

export const mockRolesMatrix = [
  { id: "r-admin", roleName: "Administrator", description: "Full system administrative control, security policy, and user management.", userCount: 4, isSystem: true, permissions: ["USER_MANAGE", "ROLE_MANAGE", "EXAM_CREATE", "AI_PAPER_GENERATE", "PROCTOR_LIVE", "SECURITY_OVERRIDE", "REPORTS_EXPORT", "AUDIT_VIEW"] },
  { id: "r-invigilator", roleName: "Invigilator", description: "Live proctoring, session monitoring, lock/unlock terminals, and incident filing.", userCount: 86, isSystem: true, permissions: ["PROCTOR_LIVE", "TERMINAL_LOCK", "INCIDENT_FILE", "CANDIDATE_VERIFY", "REPORTS_VIEW"] },
  { id: "r-candidate", roleName: "Candidate", description: "Access to assigned exam hall waiting room, active CBT exam canvas, and scorecards.", userCount: 14250, isSystem: true, permissions: ["EXAM_TAKE", "PROFILE_VIEW", "RESULT_VIEW"] },
  { id: "r-operator", roleName: "Operator", description: "Examination center setup, seat mapping, candidate registration, and hardware checks.", userCount: 18, isSystem: false, permissions: ["EXAM_CREATE", "SEAT_MAP", "CANDIDATE_REGISTER", "HARDWARE_CHECK"] },
  { id: "r-support", roleName: "Support Staff", description: "Read-only helpdesk access, password reset assistance, and candidate support ticket logs.", userCount: 12, isSystem: false, permissions: ["CANDIDATE_VIEW", "PASSWORD_RESET", "TICKET_MANAGE"] }
];

export const mockOrganizationProfile = {
  name: "National Examination Authority & CBT Council",
  code: "NEA-CBT-2026",
  logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format&fit=crop&q=80",
  address: "Tech Innovation Tower, Sector 62, Apex Education Zone",
  city: "New Delhi",
  country: "India",
  postalCode: "110001",
  email: "contact@nexiscbt.org",
  phone: "+91 (011) 2456-7890",
  website: "https://nexiscbt.org",
  examinationAuthority: "Ministry of Education & National Assessment Board",
  timeZone: "(UTC+05:30) Asia/Kolkata (IST)",
  brandingPrimaryColor: "#4f46e5",
  secondaryColor: "#059669"
};

export const mockExamCenters = [
  { id: "cnt-1", name: "Main Campus Testing Center - Hall A", code: "CTR-DEL-01", location: "Building B, Floor 2", capacity: 500, rooms: 10, terminals: 500, status: "ACTIVE", invigilatorInCharge: "Dr. Harold Vance" },
  { id: "cnt-2", name: "North Zone Digital Kiosk Lab - Hall B", code: "CTR-DEL-02", location: "Technology Block, Floor 1", capacity: 350, rooms: 7, terminals: 350, status: "ACTIVE", invigilatorInCharge: "Prof. S. Gupta" },
  { id: "cnt-3", name: "South Regional Evaluation Center", code: "CTR-BLR-01", location: "Innovation Park, Hall C", capacity: 400, rooms: 8, terminals: 400, status: "MAINTENANCE", invigilatorInCharge: "Ms. Maya Jenkins" }
];

export const mockSecuritySettingsData = {
  passwordMinLength: 12,
  requireSpecialChar: true,
  requireNumbers: true,
  passwordExpiryDays: 90,
  sessionTimeoutMinutes: 15,
  enforce2FA: true,
  maxLoginAttempts: 3,
  lockoutDurationMinutes: 30,
  ipWhitelist: ["192.168.1.0/24", "10.0.0.0/16", "172.16.0.0/12"],
  auditLoggingEnabled: true,
  encryptDatabaseAtRest: true
};

export const mockAIConfigData = {
  primaryProvider: "Vertex AI Gemini 1.5 Pro",
  temperature: 0.2,
  topP: 0.95,
  maxTokens: 4096,
  fallbackProvider: "Claude 3.5 Sonnet (Secondary)",
  localLLMFallback: "Local Llama 3 70B Kiosk Engine (Offline Backup)",
  generationLimitsDaily: 500,
  currentUsageToday: 42,
  validationStrictness: "HIGH_98_PERCENT",
  promptTemplates: [
    { name: "Stem Clarifying Prompt", version: "v2.1", status: "ACTIVE" },
    { name: "Distractor Quality Evaluator", version: "v1.8", status: "ACTIVE" },
    { name: "Bloom Taxonomy Classifier", version: "v3.0", status: "ACTIVE" }
  ]
};

export const mockInfrastructureStatusData = [
  { name: "MongoDB Primary Cluster", type: "Database", status: "HEALTHY", uptime: "99.99%", latency: "2.1ms", details: "3 Replicas Active (14.2 GB Used)" },
  { name: "Redis Cache Cluster", type: "In-Memory Cache", status: "HEALTHY", uptime: "100%", latency: "0.4ms", details: "Session Store Active (2.1M Keys)" },
  { name: "Google Cloud Storage (GCS)", type: "Object Storage", status: "HEALTHY", uptime: "99.98%", latency: "14ms", details: "Encrypted Encrypted Snapshots (1.2 TB)" },
  { name: "RabbitMQ Event Queue", type: "Message Broker", status: "HEALTHY", uptime: "99.95%", latency: "1.1ms", details: "Proctoring Stream Queue (0 Backlog)" },
  { name: "Kong API Gateway", type: "API Ingress", status: "HEALTHY", uptime: "100%", latency: "4.2ms", details: "Rate Limiting Enforced (840 Req/s)" }
];

export const mockNotificationsList = [
  { id: "n-101", title: "AI Paper Validation Complete", type: "AI", text: "Blueprint #BP-2026-CS generated 50 items with 98.4% quality index.", timestamp: "10 mins ago", isRead: false },
  { id: "n-102", title: "Proctor Security Alert", type: "SECURITY", text: "Candidate CBT-2026-0158 tab-switch violation acknowledged by invigilator.", timestamp: "25 mins ago", isRead: false },
  { id: "n-103", title: "System Scheduled Maintenance", type: "SYSTEM", text: "Database indexing scheduled tonight at 02:00 AM IST. No downtime expected.", timestamp: "2 hours ago", isRead: true },
  { id: "n-104", title: "Session Slot #02 Started", type: "EXAM", text: "Medical Board Entrance Slot 02 initialized with 1,420 active candidates.", timestamp: "3 hours ago", isRead: true }
];

export const mockAuditLogEntries = [
  { id: "alg-1", timestamp: "2026-08-06 10:45:12", user: "Dr. Harold Vance", module: "Security & Policy", action: "Updated 2FA Enforcement Policy", status: "SUCCESS", ip: "192.168.1.104", description: "Enforced mandatory TOTP 2FA across all Administrator accounts." },
  { id: "alg-2", timestamp: "2026-08-06 10:32:05", user: "Prof. S. Gupta", module: "Live Proctoring", action: "Unlocked Candidate Terminal", status: "SUCCESS", ip: "192.168.1.108", description: "Overrode terminal lock for TRM-02-14 following hardware reboot." },
  { id: "alg-3", timestamp: "2026-08-06 10:14:20", user: "Vertex AI Pipeline Engine", module: "AI Paper Generation", action: "Generated Master Exam Paper", status: "SUCCESS", ip: "10.0.4.12", description: "Generated 50 validated items for National CS Entrance 2026." },
  { id: "alg-4", timestamp: "2026-08-06 09:55:00", user: "System Monitor", module: "Infrastructure", action: "Database Backup Completed", status: "SUCCESS", ip: "10.0.1.1", description: "Automated snapshot saved to GCS Bucket gs://nexis-cbt-backups." }
];

export const mockFaqList = [
  { q: "How does the AI anti-cheat proctoring guard handle network drops?", a: "If internet connection drops during an active exam, the local browser kiosk caches candidate responses locally with AES-256 encryption until connectivity is restored." },
  { q: "What is the procedure for unlocking a locked candidate terminal?", a: "Invigilators can select the flagged candidate from the Live Monitoring Grid and click 'Unlock Terminal' using their proctor credentials." },
  { q: "How are AI-generated question blueprints validated for quality?", a: "Every item generated by Vertex AI Gemini passes through 7 automated pipeline stages checking distractor validity, Bloom taxonomy, difficulty balance, and stem duplicate detection." }
];




