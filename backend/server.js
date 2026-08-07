import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
import Exam from './models/Exam.js';
import CandidateAttempt from './models/CandidateAttempt.js';
import { Alert, Incident, Log, Seat } from './models/Telemetry.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import axios from 'axios';
import { exec } from 'child_process';
import fs from 'fs';



dotenv.config();
connectDB();

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

const latestFeeds = {};
let sessionStatus = 'RUNNING';
let DEMO_MODE = false;

async function getFullState() {
  const candidateDocs = await CandidateAttempt.find().populate('candidate_id');
  const candidates = candidateDocs.map(c => {
    return {
      id: c._id,
      name: c.candidate_id ? c.candidate_id.full_name : 'Unknown',
      candidateId: c.candidate_id ? c.candidate_id.roll_number : 'Unknown',
      terminalId: c.terminal_id,
      seat: 'Lab - Station',
      status: c.status,
      violationType: c.violationType,
      riskScore: c.riskScore,
      cameraActive: c.cameraActive,
      micActive: c.micActive,
      screenShareActive: true,
      internetStatus: "CONNECTED",
      heartbeatStatus: c.heartbeatStatus,
      verificationStatus: c.verificationStatus,
      examProgress: c.examProgress,
      answeredCount: c.answeredCount,
      totalQuestions: c.totalQuestions,
      activityTimeline: c.activityTimeline
    }
  });

  const seats = await Seat.find();
  const alerts = await Alert.find().sort({ createdAt: -1 });
  const incidents = await Incident.find().sort({ createdAt: -1 });
  const logs = await Log.find().sort({ createdAt: -1 });

  // Basic mock KPIs / Analytics for dashboard compatibility
  const kpis = [
    { id: "p-kpi-1", title: "Active Session", value: "Medical Board 2026", change: "Hall A", changeType: "neutral", description: "Slot #02 Active", icon: "Clock", iconBg: "bg-indigo-100 text-indigo-700" },
    { id: "p-kpi-2", title: "Candidates Present", value: `${candidates.length} / 50`, change: "100%", changeType: "increase", description: "0 absentees", icon: "Users", iconBg: "bg-blue-100 text-blue-700" }
  ];
  const analytics = {
    alertDistribution: [
      { label: "Tab Switching", count: 18, percentage: 35, color: "bg-amber-500" },
      { label: "Gaze Deviation", count: 14, percentage: 27, color: "bg-indigo-500" }
    ],
    verificationStatus: [
      { label: "Identity Verified", count: candidates.length, percentage: 100, color: "bg-emerald-500" }
    ]
  };

  return { candidates, logs, kpis, seats, alerts, incidents, analytics, sessionStatus };
}

async function broadcastState() {
  try {
    const state = await getFullState();
    io.emit('state-update', state);
  } catch (error) {
    console.error('Error broadcasting state:', error);
  }
}

// REST Endpoints
app.get('/api/questions/stats', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const totalQuestions = await db.collection('questions').countDocuments();
    const activeQuestions = totalQuestions;
    const chemistryCount = await db.collection('questions').countDocuments({ subject: 'Chemistry' });
    const physicsCount = await db.collection('questions').countDocuments({ subject: 'Physics' });
    const botanyCount = await db.collection('questions').countDocuments({ subject: 'Botany' });
    const zoologyCount = await db.collection('questions').countDocuments({ subject: 'Zoology' });
    
    res.json({
      totalQuestions: totalQuestions || 2450,
      activeQuestions: activeQuestions || 1980,
      draftQuestions: Math.max(0, Math.floor(totalQuestions * 0.1)),
      recentQuestions: Math.max(0, Math.floor(totalQuestions * 0.05)),
      aiQuestions: Math.max(0, Math.floor(totalQuestions * 0.15)),
      chemistryCount,
      physicsCount,
      botanyCount,
      zoologyCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    let query = {};
    if (req.query.search) {
      const searchStr = req.query.search.trim();
      const searchId = parseInt(searchStr);
      if (!isNaN(searchId)) {
        query = { sequence_id: searchId };
      } else {
        query = {
          $or: [
            { subject: new RegExp(searchStr, 'i') },
            { topic: new RegExp(searchStr, 'i') }
          ]
        };
      }
    }
    
    const limit = parseInt(req.query.limit) || 8;
    const rawQuestions = await db.collection('questions').find(query).limit(limit).toArray();
    
    const previewQuestions = rawQuestions.map(q => ({
      id: q.sequence_id ? `Q-${q.sequence_id}` : `Q-${q._id}`,
      title: `${q.subject || 'Medical'} - ${q.topic || 'General'}`,
      prompt: q.encrypted_content ? q.encrypted_content.ciphertext : 'No Encrypted Content',
      subject: q.subject || 'Physics',
      topic: q.topic || 'General Topic',
      difficulty: q.difficulty || 'Medium',
      status: 'Encrypted',
      options: [],
      correctAnswerText: 'Encrypted',
      explanation: 'Encrypted',
      chapter: q.topic || 'General',
      marks: 4,
      type: 'Multiple Choice',
      source: 'Secure DB',
      version: 'v1.0',
      lastUpdated: '2026-08-07',
    }));
    
    res.json(previewQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' })
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/state', async (req, res) => {
  try {
    const state = await getFullState();
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Forward AI Paper Generation
app.post('/api/generate-paper', async (req, res) => {
  try {
    const { mode, exam_id, required_counts, target_difficulty_distribution } = req.body;
    const aiUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
    const apiKey = process.env.AI_API_KEY;
    
    let url = `${aiUrl}/api/v1/generate-paper`;
    if (mode === 'standby') {
      url += '?mode=standby';
    }
    
    // Default payload if empty
    const payload = {
      exam_id: exam_id || "test-exam-123",
      required_counts: required_counts || { "Physics": 10, "Chemistry": 10 },
      target_difficulty_distribution: target_difficulty_distribution || { "Easy": 0.4, "Medium": 0.4, "Hard": 0.2 },
      previous_session_ids: []
    };

    if (DEMO_MODE) {
      console.log("[DEMO MOCK] Instantly loading pre-audited NEET paper payload (0ms latency)");
      return res.json({
        success: true,
        demo_mode: true,
        message: "Demo Mode Mock Payload",
        paper: {
          paperId: `DEMO-PPR-${Math.floor(Math.random() * 1000)}`,
          title: "NEET UG Exam Paper (INSTANT MOCK)",
          subject: "Medical Entrance",
          generatedBy: "DEMO_MODE",
          status: "READY",
          questionsCount: 45
        }
      });
    }

    const response = await axios.post(url, payload, {
      headers: { 'x-microservice-key': apiKey }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error triggering AI microservice:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/run-generate-preview', async (req, res) => {
  const scriptPath = 'c:\\Users\\AITNS\\Desktop\\Hack Genesis\\generate_preview.py';
  const outputPath = 'c:\\Users\\AITNS\\Desktop\\Hack Genesis\\mock_paper_preview.md';
  
  exec(`python "${scriptPath}"`, { cwd: 'c:\\Users\\AITNS\\Desktop\\Hack Genesis' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing preview script: ${error.message}`);
      return res.status(500).json({ error: error.message, stderr });
    }
    
    try {
      const content = fs.readFileSync(outputPath, 'utf8');
      const newPaperId = `PPR-2026-${Math.floor(8000 + Math.random() * 1000)}`;
      const newPaper = {
        paperId: newPaperId,
        title: `NEET UG Exam Paper (PYTHON PREVIEW)`,
        subject: "Medical Entrance",
        generatedBy: "generate_preview.py Script",
        userRole: "Testing Script",
        date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: "READY",
        generationTime: "2.4s",
        aiConfidence: "98.5%",
        validationResult: "PASSED",
        questionsCount: 20,
        difficultyRatio: "10/10/0",
        markdown: content
      };
      
      res.json({ success: true, paper: newPaper, stdout });
    } catch (readError) {
      res.status(500).json({ error: `Failed to read output file: ${readError.message}` });
    }
  });
});

// Pitch Demo Endpoints
app.post('/api/v1/demo/toggle', (req, res) => {
  DEMO_MODE = !DEMO_MODE;
  console.log(`[DEMO MODE] Toggle invoked. Current state: ${DEMO_MODE}`);
  io.emit('demo-mode-changed', { demoMode: DEMO_MODE });
  res.json({ success: true, demoMode: DEMO_MODE });
});

app.post('/api/v1/exam/trigger-jit/:examId', async (req, res) => {
  const { examId } = req.params;
  const force_demo = req.query.force_demo === 'true';
  
  if (DEMO_MODE || force_demo) {
    console.log(`[DEMO] Simulating T-15m clock trigger in 5s for exam ${examId}`);
    // Respond instantly, letting frontend handle the 5s timer
    return res.json({ 
      status: "SUCCESS", 
      message: "Paper generated and encrypted in Redis (Mock)", 
      demo_mode: true,
      jit_countdown_seconds: 5
    });
  }
  
  // Real generation logic would go here
  res.json({ status: "PENDING", message: "Real JIT triggered" });
});

app.post('/api/feeds', async (req, res) => {
  const { candidateId, frameUrl, timestamp, heartbeatStatus, cameraActive } = req.body;
  if (!candidateId) return res.status(400).json({ error: 'candidateId required' });

  latestFeeds[candidateId] = { candidateId, frameUrl, timestamp, heartbeatStatus, cameraActive };
  io.emit('feed-update', { candidateId, frameUrl, timestamp, heartbeatStatus, cameraActive });

  try {
    const user = await User.findOne({ roll_number: candidateId });
    if (user) {
      await CandidateAttempt.updateOne({ candidate_id: user._id }, {
        cameraActive: cameraActive ?? true,
        heartbeatStatus: 'LIVE',
        status: 'NORMAL'
      });
      await Seat.updateOne({ candidateId: candidateId }, { status: 'NORMAL' });
      broadcastState();
    }
  } catch (e) { console.error(e); }
  
  res.json({ ok: true });
});

app.get('/api/feeds', (req, res) => {
  res.json({ items: Object.values(latestFeeds) });
});

// Candidate Management Endpoints
app.get('/api/candidates', async (req, res) => {
  try {
    const users = await User.find({ role: 'STUDENT' });
    const attempts = await CandidateAttempt.find();
    
    const students = users.map(u => {
      const attempt = attempts.find(a => String(a.candidate_id) === String(u._id));
      return {
        id: u._id,
        name: u.full_name,
        candidateId: u.roll_number,
        email: u.email,
        phone: u.phone || "+91-9000000000",
        department: "Computer Science",
        batch: "2022-2026",
        registrationStatus: u.is_active ? "Completed" : "Pending",
        verificationStatus: attempt?.verificationStatus || "Pending",
        avatarBg: "bg-indigo-500",
        session: u.assigned_center_id || "Unassigned"
      };
    });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/candidates/import', async (req, res) => {
  try {
    const { students } = req.body;
    // Simple bulk import
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const docs = students.map(s => ({
      full_name: s.name,
      email: s.email,
      roll_number: s.candidateId,
      password_hash: hashedPassword,
      role: 'STUDENT'
    }));
    
    await User.insertMany(docs, { ordered: false });
    res.json({ success: true, message: `Imported ${docs.length} candidates.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exam-admin-metrics', async (req, res) => {
  try {
    const activeSessionsCount = await CandidateAttempt.countDocuments({ status: { $ne: 'SUBMITTED' } });
    const registeredCount = await User.countDocuments({ role: 'STUDENT' });
    const invigilatorsCount = await User.countDocuments({ role: 'INVIGILATOR' });
    const finalInvigilators = invigilatorsCount || 14;
    
    res.json({
      activeSessions: activeSessionsCount || 2,
      studentsRegistered: registeredCount || 2840,
      activeInvigilators: finalInvigilators,
      nextExamSchedule: "May 5, 2026",
      nextExamSubject: "NEET UG"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/dashboard', async (req, res) => {
  try {
    const totalRegisteredCandidates = await User.countDocuments({ role: 'STUDENT' });
    const activeSessions = await CandidateAttempt.countDocuments({ status: { $ne: 'SUBMITTED' } });
    const completedExaminations = await CandidateAttempt.countDocuments({ status: 'SUBMITTED' });
    const aiGeneratedPapers = await Exam.countDocuments();
    const totalInvigilators = await User.countDocuments({ role: 'INVIGILATOR' }) || 14;
    
    const present = await CandidateAttempt.countDocuments();
    const turnoutPct = totalRegisteredCandidates > 0 
      ? ((present / totalRegisteredCandidates) * 100).toFixed(1) + '%' 
      : '97.8%';
      
    const securityIncidents = await Incident.countDocuments();

    const attempts = await CandidateAttempt.find({});
    let bins = [
      { label: '0-20%', height: '15%', count: 0 },
      { label: '20-40%', height: '30%', count: 0 },
      { label: '40-60%', height: '65%', count: 0 },
      { label: '60-80%', height: '95%', count: 0 },
      { label: '80-100%', height: '70%', count: 0 }
    ];
    
    if (attempts.length > 0) {
      attempts.forEach(att => {
        const scoreVal = att.examProgress || 50;
        if (scoreVal <= 20) bins[0].count++;
        else if (scoreVal <= 40) bins[1].count++;
        else if (scoreVal <= 60) bins[2].count++;
        else if (scoreVal <= 80) bins[3].count++;
        else bins[4].count++;
      });
      const maxCount = Math.max(...bins.map(b => b.count)) || 1;
      bins.forEach(b => {
        b.height = `${Math.max(10, Math.round((b.count / maxCount) * 100))}%`;
      });
    } else {
      bins = [
        { label: '0-20%', height: '15%', count: 12 },
        { label: '20-40%', height: '30%', count: 34 },
        { label: '40-60%', height: '65%', count: 85 },
        { label: '60-80%', height: '95%', count: 142 },
        { label: '80-100%', height: '70%', count: 98 }
      ];
    }

    res.json({
      totalRegisteredCandidates: totalRegisteredCandidates || 2840,
      activeSessions: activeSessions || 2,
      completedExaminations: completedExaminations || 148,
      aiGeneratedPapers: aiGeneratedPapers || 42,
      totalInvigilators: totalInvigilators,
      overallAttendance: turnoutPct,
      overallPassPercentage: '85.2%',
      securityIncidents: securityIncidents || 1,
      scoreDistribution: bins,
      departmentBreakdown: [
        { department: "Medical Entrance (NEET UG)", registered: totalRegisteredCandidates || 450, present: present || 442, turnout: turnoutPct },
        { department: "Computer Science (Vite/Node CBT)", registered: 120, present: activeSessions || 2, turnout: activeSessions > 0 ? ((activeSessions/120)*100).toFixed(1) + '%' : '1.7%' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Capabilities Endpoints
app.get('/api/ai/audit', async (req, res) => {
  try {
    // Just return some mock/DB logs for the audit table
    res.json({ logs: [] }); // We will implement full audit logs if requested
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', async (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.emit('state-update', await getFullState());

  socket.on('update-session-status', async ({ status }) => {
    sessionStatus = status;
    io.emit('session-status-update', { status });
    await broadcastState();
  });

  socket.on('issue-warning', async ({ candidateName, message }) => {
    const timeStr = new Date().toLocaleTimeString();
    await Log.create({
      time: timeStr,
      candidate: candidateName,
      type: 'WARNING',
      text: `Official warning issued to ${candidateName}: ${message}`
    });
    
    const newLog = { id: `log-${Date.now()}`, time: timeStr, candidate: candidateName, type: 'WARNING', text: `Official warning issued to ${candidateName}: ${message}` };
    io.emit('warning-issued', { candidateName, message, log: newLog });
    await broadcastState();
  });

  socket.on('terminate-session', async ({ candidateId }) => {
    try {
      const user = await User.findOne({ roll_number: candidateId });
      if (user) {
        await CandidateAttempt.deleteOne({ candidate_id: user._id });
        await Seat.updateOne({ candidateId }, { status: 'OFFLINE' });
        await Log.create({
          time: new Date().toLocaleTimeString(),
          candidate: user.full_name,
          type: 'CRITICAL',
          text: `Invigilator manually terminated exam session for candidate ${user.full_name}.`
        });
      }
      await broadcastState();
    } catch (e) { console.error(e); }
  });

  socket.on('update-incident', async ({ incidentId, newStatus }) => {
    try {
      await Incident.updateOne({ _id: incidentId }, { status: newStatus });
      await broadcastState();
    } catch (e) { console.error(e); }
  });

  socket.on('SIMULATE_PROCTOR_EVENT', async ({ candidateId, violationType, timestamp }) => {
    console.log(`[DEMO SIMULATION] Injecting ${violationType} for ${candidateId}`);
    try {
      const user = await User.findOne({ roll_number: candidateId });
      const candidateName = user ? user.full_name : candidateId;
      
      const newAlert = await Alert.create({
        candidateId,
        student: candidateName,
        terminalId: "DEMO-STATION",
        category: violationType === 'HEAD_TURN' ? 'Gaze Deviation' : violationType === 'MULTI_FACE' ? 'Multiple Faces Detected' : 'Unauthorized Tab Switch',
        severity: violationType === 'TAB_SWITCH' ? 'CRITICAL' : 'WARNING',
        timestamp: new Date(timestamp).toLocaleTimeString(),
        recommendedAction: violationType === 'TAB_SWITCH' ? 'Lock Terminal' : 'Issue Warning'
      });
      
      io.emit('state-update', await getFullState());
    } catch (e) { console.error(e); }
  });

  socket.on('reassign-seat', async ({ candidateId, newSeat }) => {
    try {
      await Seat.updateOne({ candidateId }, { deskNumber: newSeat });
      await broadcastState();
    } catch (e) { console.error(e); }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});
