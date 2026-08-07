import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// --- State Store ---
let candidates = [
  {
    id: "cand-1",
    name: "Aarav Sharma",
    candidateId: "CBT-2026-0891",
    terminalId: "TRM-04-12",
    seat: "Lab 04 - Station 12",
    status: "CRITICAL",
    violationType: "Multiple Faces Detected",
    riskScore: 94,
    cameraActive: true,
    micActive: true,
    screenShareActive: true,
    internetStatus: "CONNECTED",
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
  }
];

let seats = [
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
  { deskNumber: "Desk 12", seatId: "S-112", terminalId: "TRM-01-12", candidateName: "Zoe Miller", candidateId: "CBT-2026-0933", status: "NORMAL" }
];

let alerts = [
  { id: "alt-1", category: "Multiple Faces", severity: "CRITICAL", timestamp: "10:42:15 AM", student: "Aarav Sharma", candidateId: "CBT-2026-0891", terminalId: "TRM-04-12", recommendedAction: "Issue Immediate Warning & Inspect Stream" },
  { id: "alt-2", category: "Camera Disabled", severity: "CRITICAL", timestamp: "10:43:00 AM", student: "Liam O'Connor", candidateId: "CBT-2026-0615", terminalId: "TRM-01-08", recommendedAction: "Dispatch On-Site Invigilator to Desk 07" },
  { id: "alt-3", category: "High Background Noise", severity: "WARNING", timestamp: "10:39:12 AM", student: "Elena Rostova", candidateId: "CBT-2026-0773", terminalId: "TRM-04-18", recommendedAction: "Mute Candidate Mic & Request Quiet" },
  { id: "alt-4", category: "Tab Switching", severity: "WARNING", timestamp: "10:41:50 AM", student: "Sophia Chen", candidateId: "CBT-2026-0412", terminalId: "TRM-02-05", recommendedAction: "Send Warning Banner & Lock Browser" },
  { id: "alt-5", category: "Face Not Detected", severity: "WARNING", timestamp: "10:38:00 AM", student: "Mateo Silva", candidateId: "CBT-2026-0811", terminalId: "TRM-01-11", recommendedAction: "Prompt Candidate to Adjust Camera Angle" }
];

let incidents = [
  { id: "inc-101", time: "10:42:15 AM", student: "Aarav Sharma", candidateId: "CBT-2026-0891", alertType: "Multiple Faces Detected", description: "Secondary person identified standing behind candidate chair.", evidence: "Webcam Frame #18420", status: "New", assignedInvigilator: "Dr. H. Vance" },
  { id: "inc-102", time: "10:41:50 AM", student: "Sophia Chen", candidateId: "CBT-2026-0412", alertType: "Tab Switching Violations", description: "Switched browser focus 3 times within 60 seconds.", evidence: "Browser Audit Trail Log", status: "Acknowledged", assignedInvigilator: "Invigilator M. Reed" },
  { id: "inc-103", time: "10:35:01 AM", student: "Gabriel Santos", candidateId: "CBT-2026-0888", alertType: "Unauthorized Device", description: "Bluetooth headset paired signal detected via proctor client.", evidence: "Device Beacon Scan", status: "Escalated", assignedInvigilator: "Chief Invigilator S. Mehta" },
  { id: "inc-104", time: "09:45:20 AM", student: "Rohan Gupta", candidateId: "CBT-2026-0112", alertType: "Biometric Discrepancy", description: "Initial face match 84% below threshold (95%). Verified manually.", evidence: "ID Card OCR vs Camera Match", status: "Resolved", assignedInvigilator: "Admin Proctor" }
];

let logs = [
  { id: "log-1", time: "10:42:15 AM", candidate: "Aarav Sharma", type: "CRITICAL", text: "AI Detector: Second person detected in webcam stream." },
  { id: "log-2", time: "10:41:50 AM", candidate: "Sophia Chen", type: "WARNING", text: "Eye Tracking: Candidate looked off-screen for > 8 seconds." },
  { id: "log-3", time: "10:39:12 AM", candidate: "Elena Rostova", type: "WARNING", text: "Acoustic Guard: Secondary voice audio signature detected." },
  { id: "log-4", time: "10:35:01 AM", candidate: "Aarav Sharma", type: "CRITICAL", text: "Window Switch: Alt-Tab or browser unfocus event." }
];

let kpis = [
  { id: "p-kpi-1", title: "Active Session", value: "Medical Board 2026", change: "Hall A", changeType: "neutral", description: "Slot #02 Active", icon: "Clock", iconBg: "bg-indigo-100 text-indigo-700" },
  { id: "p-kpi-2", title: "Candidates Present", value: "450 / 460", change: "97.8%", changeType: "increase", description: "10 absentees", icon: "Users", iconBg: "bg-blue-100 text-blue-700" },
  { id: "p-kpi-3", title: "Candidates Verified", value: "442", change: "98.2%", changeType: "increase", description: "Biometrics clear", icon: "CheckCircle", iconBg: "bg-emerald-100 text-emerald-700" },
  { id: "p-kpi-4", title: "Candidates Flagged", value: "18", change: "4.0%", changeType: "decrease", description: "Requires review", icon: "AlertTriangle", iconBg: "bg-amber-100 text-amber-700" },
  { id: "p-kpi-5", title: "Active Alerts", value: "5", change: "Critical", changeType: "decrease", description: "Unresolved queue", icon: "ShieldAlert", iconBg: "bg-red-100 text-red-700" },
  { id: "p-kpi-6", title: "Incidents Today", value: "12", change: "8 Resolved", changeType: "increase", description: "Audit trail log", icon: "Activity", iconBg: "bg-purple-100 text-purple-700" }
];

let analytics = {
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

// Feed storage (base64 webcam frames for fallback/sync)
const latestFeeds = {};
let sessionStatus = 'RUNNING'; // 'RUNNING', 'PAUSED', 'LOCKED', 'ENDED'

// Helper to broadcast state to all clients
function broadcastState() {
  io.emit('state-update', {
    candidates,
    logs,
    kpis,
    seats,
    alerts,
    incidents,
    analytics,
    sessionStatus
  });
}

// REST Endpoints
app.get('/api/state', (req, res) => {
  res.json({ candidates, logs, kpis, seats, alerts, incidents, analytics, sessionStatus });
});

app.post('/api/feeds', (req, res) => {
  const { candidateId, frameUrl, timestamp, heartbeatStatus, cameraActive } = req.body;
  if (!candidateId) {
    return res.status(400).json({ error: 'candidateId required' });
  }
  latestFeeds[candidateId] = { candidateId, frameUrl, timestamp, heartbeatStatus, cameraActive };
  
  // Broadcast live feed update to invigilators
  io.emit('feed-update', { candidateId, frameUrl, timestamp, heartbeatStatus, cameraActive });
  
  // Update candidate heartbeat and camera status dynamically
  const candidateIndex = candidates.findIndex(c => c.candidateId === candidateId);
  if (candidateIndex > -1) {
    candidates[candidateIndex].cameraActive = cameraActive ?? true;
    candidates[candidateIndex].heartbeatStatus = 'LIVE';
    candidates[candidateIndex].status = 'NORMAL';
    
    // Update matching seat status
    const seatIndex = seats.findIndex(s => s.candidateId === candidateId);
    if (seatIndex > -1) {
      seats[seatIndex].status = 'NORMAL';
    }
    broadcastState();
  }

  res.json({ ok: true });
});

app.get('/api/feeds', (req, res) => {
  res.json({ items: Object.values(latestFeeds) });
});

app.get('/api/feeds/:candidateId/stream', (req, res) => {
  const { candidateId } = req.params;
  
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const intervalId = setInterval(() => {
    const feed = latestFeeds[candidateId];
    if (feed && feed.frameUrl && feed.frameUrl.startsWith('data:image')) {
      try {
        const base64Data = feed.frameUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        res.write(`--frame\r\n`);
        res.write(`Content-Type: image/jpeg\r\n`);
        res.write(`Content-Length: ${buffer.length}\r\n\r\n`);
        res.write(buffer);
        res.write(`\r\n`);
      } catch (err) {
        clearInterval(intervalId);
        res.end();
      }
    }
  }, 250);

  req.on('close', () => {
    clearInterval(intervalId);
  });
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Send current state on connection
  socket.emit('state-update', { candidates, logs, kpis, seats, alerts, incidents, analytics, sessionStatus });

  // Handle session status updates
  socket.on('update-session-status', ({ status }) => {
    sessionStatus = status;
    io.emit('session-status-update', { status });
    broadcastState();
  });

  // Handle frame uploads via socket
  socket.on('candidate-frame', (data) => {
    const { candidateId, frameUrl, cameraActive } = data;
    latestFeeds[candidateId] = {
      candidateId,
      frameUrl,
      timestamp: Date.now(),
      heartbeatStatus: 'LIVE',
      cameraActive
    };
    io.emit('feed-update', latestFeeds[candidateId]);
  });

  // Handle actions from Invigilator
  socket.on('issue-warning', ({ candidateName, message }) => {
    const timeStr = new Date().toLocaleTimeString();
    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      candidate: candidateName,
      type: 'WARNING',
      text: `Official warning issued to ${candidateName}: ${message}`
    };
    logs.unshift(newLog);
    
    // Broadcast to candidates & invigilators
    io.emit('warning-issued', { candidateName, message, log: newLog });
    broadcastState();
  });

  socket.on('terminate-session', ({ candidateId }) => {
    const timeStr = new Date().toLocaleTimeString();
    
    // Find candidate name
    const cand = candidates.find(c => c.id === candidateId || c.candidateId === candidateId);
    const candidateName = cand ? cand.name : candidateId;

    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      candidate: candidateName,
      type: 'CRITICAL',
      text: `Invigilator manually terminated exam session for candidate ${candidateName}.`
    };
    logs.unshift(newLog);

    candidates = candidates.filter(c => c.id !== candidateId && c.candidateId !== candidateId);
    seats = seats.map(s => {
      if (s.candidateId === candidateId) {
        return { ...s, status: 'OFFLINE' };
      }
      return s;
    });

    io.emit('session-terminated', { candidateId, candidateName, log: newLog });
    broadcastState();
  });

  socket.on('update-incident', ({ incidentId, newStatus }) => {
    incidents = incidents.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, status: newStatus };
      }
      return inc;
    });
    broadcastState();
  });

  socket.on('reassign-seat', ({ candidateId, newSeat }) => {
    candidates = candidates.map(c => {
      if (c.id === candidateId || c.candidateId === candidateId) {
        return { ...c, seat: newSeat };
      }
      return c;
    });
    seats = seats.map(s => {
      if (s.candidateId === candidateId) {
        return { ...s, deskNumber: newSeat };
      }
      return s;
    });
    broadcastState();
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});
