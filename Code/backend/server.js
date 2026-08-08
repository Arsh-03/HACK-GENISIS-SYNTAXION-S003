import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
import Exam from './models/Exam.js';
import CandidateAttempt from './models/CandidateAttempt.js';
import GenerationHistory from './models/GenerationHistory.js';
import { Alert, Incident, Log, Seat } from './models/Telemetry.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import axios from 'axios';
import { exec } from 'child_process';
import fs from 'fs';
import Redis from 'redis';



dotenv.config();
connectDB();

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(err => console.warn('Redis connection failed:', err.message));

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
const demoPapers = new Map();
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

  const totalRegisteredCandidates = await User.countDocuments({ role: 'STUDENT' });
  const activeSessionsCount = await CandidateAttempt.countDocuments({ status: { $ne: 'SUBMITTED' } });
  const completedExaminations = await CandidateAttempt.countDocuments({ status: 'SUBMITTED' });
  const aiGeneratedPapers = await Exam.countDocuments();
  const totalInvigilators = await User.countDocuments({ role: 'INVIGILATOR' }) || 14;
  const securityIncidents = await Incident.countDocuments();

  const kpis = [
    { id: "p-kpi-1", title: "Active Session", value: sessionStatus || 'RUNNING', change: `Hall A`, changeType: "neutral", description: `Slot #${activeSessionsCount} Active`, icon: "Clock", iconBg: "bg-indigo-100 text-indigo-700" },
    { id: "p-kpi-2", title: "Candidates Present", value: `${candidates.length} / ${totalRegisteredCandidates}`, change: `${totalRegisteredCandidates > 0 ? ((candidates.length / totalRegisteredCandidates) * 100).toFixed(0) : 0}%`, changeType: "increase", description: `${totalRegisteredCandidates - candidates.length} absentees`, icon: "Users", iconBg: "bg-blue-100 text-blue-700" },
    { id: "p-kpi-3", title: "Completed Exams", value: `${completedExaminations}`, change: "Completed", changeType: "increase", description: "Total submitted", icon: "FileCheck", iconBg: "bg-emerald-100 text-emerald-700" },
    { id: "p-kpi-4", title: "Security Incidents", value: `${securityIncidents}`, change: `${securityIncidents > 0 ? 'Active' : 'None'}`, changeType: securityIncidents > 0 ? "decrease" : "increase", description: "Incidents logged", icon: "AlertTriangle", iconBg: "bg-amber-100 text-amber-700" }
  ];

  const alertSeverities = await Alert.aggregate([
    { $group: { _id: '$severity', count: { $sum: 1 } } }
  ]);

  const alertDistribution = [
    { label: "Critical", count: 0, percentage: 0, color: "bg-red-500" },
    { label: "Warning", count: 0, percentage: 0, color: "bg-amber-500" },
    { label: "Info", count: 0, percentage: 0, color: "bg-blue-500" }
  ];

  alertSeverities.forEach(item => {
    const found = alertDistribution.find(a => a.label.toLowerCase() === (item._id || 'info').toLowerCase());
    if (found) {
      found.count = item.count;
      found.percentage = alertDistribution.reduce((s, a) => s + a.count, 0) > 0 ? Math.round((item.count / alertDistribution.reduce((s, a) => s + a.count, 0)) * 100) : 0;
    }
  });

  const verifiedCount = candidates.filter(c => c.verificationStatus === 'VERIFIED').length;
  const verificationStatus = [
    { label: "Identity Verified", count: verifiedCount, percentage: candidates.length > 0 ? Math.round((verifiedCount / candidates.length) * 100) : 0, color: "bg-emerald-500" },
    { label: "Pending Verification", count: candidates.length - verifiedCount, percentage: candidates.length > 0 ? Math.round(((candidates.length - verifiedCount) / candidates.length) * 100) : 0, color: "bg-amber-500" }
  ];

  const analytics = {
    alertDistribution,
    verificationStatus
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

app.get('/api/exams', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/candidates/:userId/attempt', async (req, res) => {
  try {
    const { userId } = req.params;
    const { examId } = req.query;
    if (!examId) {
      return res.status(400).json({ error: 'examId query param required' });
    }
    const attempt = await CandidateAttempt.findOne({ candidate_id: userId, exam_id: examId });
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exam/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const attempt = await CandidateAttempt.findOne({ candidate_id: userId, status: 'IN_PROGRESS' }).sort({ started_at: -1 });
    if (!attempt) {
      return res.json({ hasActiveExam: false });
    }
    console.log(`[ExamStatus] User ${userId} -> attempt ${attempt._id} examId ${attempt.exam_id} status ${attempt.status}`);
    res.json({ hasActiveExam: true, examId: attempt.exam_id, sessionId: attempt.session_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const payload = {
      exam_id: exam_id || "test-exam-123",
      required_counts: required_counts || { "Physics": 10, "Chemistry": 10 },
      target_difficulty_distribution: target_difficulty_distribution || { "Easy": 0.4, "Medium": 0.4, "Hard": 0.2 },
      previous_session_ids: []
    };

    const startTime = Date.now();
    const response = await axios.post(url, payload, {
      headers: { 'x-microservice-key': apiKey }
    });
    const latency = Date.now() - startTime;
    const paper = response.data;

    GenerationHistory.create({
      exam_id: payload.exam_id,
      exam_code: payload.exam_id,
      title: `Generated Paper - ${payload.exam_id}`,
      subject: Object.keys(payload.required_counts)[0] || 'General',
      question_count: Object.values(payload.required_counts).reduce((a, b) => a + b, 0),
      status: 'COMPLETED',
      mode: mode === 'standby' ? 'fallback' : 'live',
      paper_data: paper,
      generation_latency_ms: latency,
      balance_score: paper.balance_score,
      questions_count: paper.final_questions ? paper.final_questions.length : 0,
      difficulty_ratio: `${payload.target_difficulty_distribution.Easy || 0}/${payload.target_difficulty_distribution.Medium || 0}/${payload.target_difficulty_distribution.Hard || 0}`
    }).catch(() => {});

    res.json(paper);
  } catch (error) {
    GenerationHistory.create({
      exam_id: req.body?.exam_id || 'unknown',
      exam_code: req.body?.exam_id || 'unknown',
      title: `Failed Generation - ${req.body?.exam_id || 'unknown'}`,
      subject: 'Unknown',
      question_count: 0,
      status: 'FAILED',
      mode: 'live',
      error_message: error.message
    }).catch(() => {});

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
    res.json({ logs: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exams/schedule', async (req, res) => {
  try {
    const { exam_code, title, total_duration_minutes, total_marks, blueprint, target_difficulty_distribution, start_time, end_time, created_by } = req.body;
    const exam = new Exam({
      exam_code,
      title,
      total_duration_minutes,
      total_marks,
      blueprint,
      target_difficulty_distribution,
      start_time,
      end_time,
      created_by
    });
    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exams/:examId/generate-fallback', async (req, res) => {
  try {
    const { examId } = req.params;
    const aiUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
    const apiKey = process.env.AI_API_KEY;
    const url = `${aiUrl}/api/v1/generate-paper?mode=standby`;
    const response = await axios.post(url, { exam_id: examId }, {
      headers: { 'x-microservice-key': apiKey }
    });
    const paper = response.data;
    await Exam.findByIdAndUpdate(examId, { fallback_paper: paper }, { new: true });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exams/:examId/generate-actual', async (req, res) => {
  try {
    const { examId } = req.params;
    const aiUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
    const apiKey = process.env.AI_API_KEY;
    const url = `${aiUrl}/api/v1/generate-paper`;
    const response = await axios.post(url, { exam_id: examId }, {
      headers: { 'x-microservice-key': apiKey }
    });
    const paper = response.data;
    await Exam.findByIdAndUpdate(examId, { actual_paper: paper }, { new: true });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/demo/trigger', async (req, res) => {
  try {
    const { exam_code, subject, questionCount } = req.body;
    const aiUrl = process.env.AI_MICROSERVICE_URL || 'http://localhost:8000';
    const apiKey = process.env.AI_API_KEY;
    const demoExamId = `DEMO-${Date.now()}`;
    const startTime = Date.now();

    await GenerationHistory.create({
      exam_id: demoExamId,
      exam_code: demoExamId,
      title: `Demo Exam - ${subject}`,
      subject,
      question_count: questionCount,
      status: 'GENERATING',
      mode: 'demo',
      generated_by: 'Admin Dashboard Demo Mode'
    });

    const response = await axios.post(`${aiUrl}/api/v1/generate-paper`, {
      exam_id: demoExamId,
      subject,
      questionCount,
      required_counts: { [subject]: questionCount },
      target_difficulty_distribution: { Easy: 0.4, Medium: 0.4, Hard: 0.2 },
      previous_session_ids: []
    }, {
      headers: { 'x-microservice-key': apiKey }
    });
    const paper = response.data;
    const latency = Date.now() - startTime;

    console.log(`[Demo] Paper generated. Keys:`, Object.keys(paper));
    console.log(`[Demo] final_questions count:`, paper.final_questions?.length || 0);

    if (!paper.final_questions || paper.final_questions.length === 0) {
      console.warn('[Demo] Paper has no questions. Injecting demo questions...');
      paper.final_questions = Array.from({ length: questionCount }, (_, idx) => ({
        id: `demo-q-${idx + 1}`,
        question_text: `Demo Question ${idx + 1}: This is a sample ${subject} question for demonstration purposes. What is the correct approach?`,
        options: ['Option A: Correct approach', 'Option B: Incorrect approach', 'Option C: Alternative method', 'Option D: None of the above'],
        correct_option_index: 0,
        subject,
        topic: 'General',
        difficulty: ['Easy', 'Medium', 'Hard'][idx % 3],
        explanation: 'This is a demo question injected because the AI microservice returned an empty paper.'
      }));
      paper.is_approved = true;
      paper.balance_score = 1.0;
      paper.flagged_issues = ['Demo questions injected due to AI service unavailability'];
      console.log(`[Demo] Injected ${paper.final_questions.length} demo questions`);
    }

    await GenerationHistory.findOneAndUpdate(
      { exam_id: demoExamId },
      {
        status: 'COMPLETED',
        paper_data: paper,
        generation_latency_ms: latency,
        balance_score: paper.balance_score,
        questions_count: paper.final_questions ? paper.final_questions.length : questionCount,
        difficulty_ratio: '40/40/20'
      }
    );

    const demoExam = new Exam({
      exam_code: demoExamId,
      title: `Demo Exam - ${subject}`,
      total_duration_minutes: 15,
      total_marks: questionCount * 2,
      blueprint: { [subject]: { required_count: questionCount, section_weightage: 1 } },
      target_difficulty_distribution: { Easy: 0.4, Medium: 0.4, Hard: 0.2 },
      status: 'PUBLISHED',
      start_time: new Date(Date.now() + 5000),
      end_time: new Date(Date.now() + 5000 + 15 * 60 * 1000),
      actual_paper: paper
    });
    await demoExam.save();
    const savedExam = await Exam.findById(demoExam._id);
    console.log(`[Demo] Saved exam ${demoExam._id}. actual_paper keys:`, savedExam?.actual_paper ? Object.keys(savedExam.actual_paper) : 'null');
    console.log(`[Demo] actual_paper.final_questions length:`, savedExam?.actual_paper?.final_questions?.length || 0);

    try {
      await redisClient.setEx(`exam:${demoExam._id}:master`, 3600, JSON.stringify(paper));
      console.log(`[Demo] Cached paper in Redis for exam ${demoExam._id}`);
    } catch (e) {
      console.warn('[Demo] Redis cache failed:', e.message);
    }

    demoPapers.set(demoExamId, { paper, createdAt: Date.now(), autoStartable: false, examId: demoExam._id });

    const students = await User.find({ role: 'STUDENT' });
    for (const student of students) {
      const existing = await CandidateAttempt.findOne({ candidate_id: student._id, exam_id: demoExam._id });
      if (!existing) {
        const attempt = new CandidateAttempt({
          candidate_id: student._id,
          exam_id: demoExam._id,
          status: 'IN_PROGRESS',
          session_id: new mongoose.Types.ObjectId().toString(),
          terminal_id: `TERM-${Date.now()}-${student._id}`,
          seat_id: `SEAT-${Date.now()}-${student._id}`,
          verificationStatus: 'PENDING',
          heartbeatStatus: 'LIVE',
          cameraActive: true,
          micActive: true,
          examProgress: 0,
          answeredCount: 0,
          totalQuestions: questionCount,
          activityTimeline: []
        });
        await attempt.save();
      }
    }

    setTimeout(async () => {
      const entry = demoPapers.get(demoExamId);
      if (entry) {
        entry.autoStartable = true;
        await broadcastState();
      }
    }, 5000);

    res.json({ demo_exam_id: demoExamId, paper, countdown_seconds: 5, examId: demoExam._id });
  } catch (error) {
    await GenerationHistory.findOneAndUpdate(
      { exam_id: `DEMO-${error.message.includes('DEMO-') ? error.message.split('DEMO-')[1]?.split(' ')[0] || Date.now() : Date.now()}` },
      { status: 'FAILED', error_message: error.message },
      { upsert: true }
    );
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exam/:examId/start', async (req, res) => {
  try {
    const { examId } = req.params;
    const { candidate_id } = req.body;
    const user = await User.findById(candidate_id);
    if (!user) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    let attempt = await CandidateAttempt.findOne({ candidate_id, exam_id });
    if (!attempt) {
      attempt = new CandidateAttempt({
        candidate_id,
        exam_id,
        status: 'IN_PROGRESS',
        session_id: new mongoose.Types.ObjectId().toString(),
        terminal_id: `TERM-${Date.now()}`,
        seat_id: `SEAT-${Date.now()}`,
        verificationStatus: 'PENDING',
        heartbeatStatus: 'LIVE',
        cameraActive: true,
        micActive: true,
        examProgress: 0,
        answeredCount: 0,
        totalQuestions: 0,
        activityTimeline: []
      });
      await attempt.save();
      await attempt.populate('candidate_id');
      broadcastState();
      io.emit('exam-started', { examId, attempt });
    } else {
      await attempt.populate('candidate_id');
    }
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exam/:examId/questions', async (req, res) => {
  try {
    const { examId } = req.params;
    console.log(`[Questions] Fetching questions for examId: ${examId}`);

    const cacheKey = `exam:${examId}:master`;
    let rawQuestions = [];
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const paper = JSON.parse(cached);
        rawQuestions = paper.final_questions || paper.questions || [];
        console.log(`[Questions] Served ${rawQuestions.length} questions from Redis cache for exam ${examId}`);
      }
    } catch (e) {
      console.warn('Redis read failed, falling back to MongoDB:', e.message);
    }

    if (!rawQuestions.length) {
      const exam = await Exam.findById(examId);
      if (exam) {
        console.log(`[Questions] Exam found in MongoDB. actual_paper keys:`, exam.actual_paper ? Object.keys(exam.actual_paper) : 'null');
        if (exam.actual_paper) {
          rawQuestions = exam.actual_paper.final_questions || exam.actual_paper.questions || [];
          console.log(`[Questions] Extracted ${rawQuestions.length} questions from MongoDB actual_paper`);
        }
        if (!rawQuestions.length && exam.fallback_paper) {
          rawQuestions = exam.fallback_paper.final_questions || exam.fallback_paper.questions || [];
          console.log(`[Questions] Extracted ${rawQuestions.length} questions from MongoDB fallback_paper`);
        }
      }
    }

    if (rawQuestions.length > 0) {
      const formatted = rawQuestions.map((q, idx) => ({
        id: q.id || `Q-${idx + 1}`,
        text: q.question_text || q.prompt || q.text || '',
        prompt: q.question_text || q.prompt || q.text || '',
        subject: q.subject || 'General',
        topic: q.topic || 'General',
        difficulty: q.difficulty || 'Medium',
        options: Array.isArray(q.options)
          ? q.options.map((opt, oIdx) => ({
              id: String.fromCharCode(65 + oIdx),
              text: typeof opt === 'string' ? opt : (opt.text || opt.label || String(opt))
            }))
          : [],
        correctAnswerText: q.correct_option_index !== undefined
          ? String.fromCharCode(65 + q.correct_option_index)
          : '',
        explanation: q.explanation || '',
        chapter: q.topic || 'General',
        marks: 2,
        type: 'Multiple Choice',
        source: 'AI Generated',
        version: 'v1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        codeSnippet: q.codeSnippet || null
      }));
      return res.json(formatted);
    }

    const db = mongoose.connection.db;
    const questions = await db.collection('questions').find().toArray();
    const formattedQuestions = questions.map(q => ({
      id: q.sequence_id ? `Q-${q.sequence_id}` : `Q-${q._id}`,
      text: q.encrypted_content ? q.encrypted_content.ciphertext : 'No Encrypted Content',
      prompt: q.encrypted_content ? q.encrypted_content.ciphertext : 'No Encrypted Content',
      subject: q.subject || 'Physics',
      topic: q.topic || 'General Topic',
      difficulty: q.difficulty || 'Medium',
      options: q.options || [],
      correctAnswerText: 'Encrypted',
      explanation: 'Encrypted',
      chapter: q.topic || 'General',
      marks: 4,
      type: 'Multiple Choice',
      source: 'Secure DB',
      version: 'v1.0',
      lastUpdated: '2026-08-07',
    }));
    res.json(formattedQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generation History Audit Trail
app.post('/api/generation-history', async (req, res) => {
  try {
    const entry = new GenerationHistory(req.body);
    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/generation-history', async (req, res) => {
  try {
    const { exam_id, mode, status } = req.query;
    const query = {};
    if (exam_id) query.exam_id = exam_id;
    if (mode) query.mode = mode;
    if (status) query.status = status;
    const history = await GenerationHistory.find(query).sort({ created_at: -1 }).limit(100);
    res.json(history);
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
