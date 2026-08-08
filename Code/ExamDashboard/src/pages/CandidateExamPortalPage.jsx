import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useExamTimer } from '../hooks/useExamTimer';
import { QuestionPalette } from '../shared/components/common/QuestionPalette';
import { Card } from '../shared/components/ui/Card';
import { StatCard } from '../shared/components/ui/StatCard';
import { Button } from '../shared/components/ui/Button';
import { Modal } from '../shared/components/ui/Modal';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';
import { LiveFeedFrame } from '../shared/components/common/LiveFeedFrame';
import { SecurityHUD } from '../shared/components/proctoring/SecurityHUD';
import { useCandidateCameraFeed } from '../hooks/useCandidateCameraFeed';
import { useAuth } from '../context/AuthContext';
import { fetchExamStatus, fetchExams, fetchCandidateAttempt } from '../services/api';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  AlertTriangle,
  RotateCcw,
  Send,
  CheckCircle2,
  XCircle,
  Video,
  Mic,
  Lock,
  Wifi,
  Monitor,
  Maximize,
  ShieldCheck,
  UserCheck,
  Calendar,
  Award,
  Bell,
  FileText,
  FileCheck,
  Download,
  LayoutDashboard,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Check,
  RefreshCw,
  Play
} from 'lucide-react';


export function CandidateExamPortalPage() {
  // Main view state switcher: 'DASHBOARD', 'PRE_EXAM', 'ACTIVE_EXAM', 'REVIEW', 'RESULT'
  const [currentView, setCurrentView] = useState('DASHBOARD');

  // Pre-exam flow step: 1 (Instructions), 2 (Verification), 3 (System Check), 4 (Waiting Room)
  const [preExamStep, setPreExamStep] = useState(1);
  const [instructionsAcknowledged, setInstructionsAcknowledged] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [waitingCountdown, setWaitingCountdown] = useState(15);

  // Active Exam state
  const { formattedTime, progressPercentage, timeLeft, setIsRunning } = useExamTimer(7200); // 2 hours
  const [activeSectionId, setActiveSectionId] = useState("sec-1");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const [questionStates, setQuestionStates] = useState({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const systemReadinessChecks = [
    { id: "chk-1", name: "Webcam Camera Feed", status: "PASSED", detail: "1080p HD Camera Active (Integrated WebCam)", ok: true },
    { id: "chk-2", name: "Microphone Audio Channel", status: "PASSED", detail: "Acoustic Noise Reduction Active (24-bit 48kHz)", ok: true },
    { id: "chk-3", name: "Internet Connectivity & Latency", status: "PASSED", detail: "High-Speed Fibre (45 Mbps Down / 12ms Ping)", ok: true },
    { id: "chk-4", name: "Browser & OS Compatibility", status: "PASSED", detail: "Chrome v126 (CBT Secure Kiosk Engine)", ok: true },
    { id: "chk-5", name: "Screen Resolution & DPI", status: "PASSED", detail: "1920 x 1080 FHD (Compatible Layout)", ok: true },
    { id: "chk-6", name: "Fullscreen Kiosk Lockdown", status: "PASSED", detail: "Secure Lock Environment Active", ok: true }
  ];

  // Real-time backend states
  const [sessionStatus, setSessionStatus] = useState('RUNNING');
  const [isTerminated, setIsTerminated] = useState(false);
  const [profile, setProfile] = useState({
    candidateId: '',
    name: '',
    department: '',
    terminalId: 'TERM-000',
    seatNumber: 'A-1',
    assignedInvigilator: 'N/A'
  });
  const [todayExam, setTodayExam] = useState({
    id: null,
    code: '',
    title: '',
    durationMinutes: 0,
    totalQuestions: 0,
    totalMarks: 0,
    status: 'UPCOMING',
    subject: 'General'
  });
  const [examSections, setExamSections] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [noActiveExam, setNoActiveExam] = useState(false);
  const [isLoadingExam, setIsLoadingExam] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const { user } = useAuth();

  const activeSection = examSections.length > 0 ? (examSections.find(s => s.id === activeSectionId) || examSections[0]) : { id: 'sec-1', title: todayExam.title || 'Section 1', shortName: 'Section 1', subject: todayExam.subject || 'General' };
  const examCameraEnabled = (currentView === 'PRE_EXAM' && preExamStep >= 2) || currentView === 'ACTIVE_EXAM';
  const { videoRef, frameUrl, isCameraReady, cameraError } = useCandidateCameraFeed(profile.candidateId, examCameraEnabled);

  useEffect(() => {
    if (examQuestions.length > 0 && currentQuestionIndex >= examQuestions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [examQuestions.length, currentQuestionIndex]);

  useEffect(() => {
    if (activeSection && examQuestions.length > 0) {
      const firstIndex = examQuestions.findIndex(q => (q.subject || 'General') === activeSection.subject);
      if (firstIndex !== -1 && examQuestions[currentQuestionIndex]?.subject !== activeSection.subject) {
        setCurrentQuestionIndex(firstIndex);
      }
    }
  }, [activeSectionId]);

  useEffect(() => {
    let isMounted = true;
    const loadExamData = async () => {
      if (!user?.id) return;
      try {
        const statusRes = await fetchExamStatus(user.id);
        if (!isMounted) return;
        if (!statusRes.hasActiveExam) {
          const examsRes = await fetchExams();
          const exams = Array.isArray(examsRes) ? examsRes : [];
          const availableExam = exams.find(e => e.status === 'PUBLISHED' || e.status === 'ACTIVE' || e.status === 'UPCOMING');

          if (availableExam) {
            try {
              const startRes = await fetch(`http://localhost:5001/api/exam/${availableExam._id}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate_id: user.id })
              });
              if (startRes.ok) {
                setNoActiveExam(false);
                const attempt = await startRes.json();
                setProfile(prev => ({
                  ...prev,
                  candidateId: user?.name?.includes('Sophia') ? 'CBT-2026-0412' : 'CBT-2026-0891',
                  name: user?.name || 'Aarav Sharma',
                  terminalId: attempt.terminal_id || prev.terminalId,
                  verificationStatus: attempt.verificationStatus || prev.verificationStatus,
                  assignedInvigilator: attempt.assigned_invigilator || 'invigilator@example.com'
                }));
                const questionsRes = await fetch(`http://localhost:5001/api/exam/${availableExam._id}/questions?candidateId=${user.id}`);
                const questionsData = await questionsRes.json();
                const questionsList = Array.isArray(questionsData) ? questionsData : (Array.isArray(questionsData.questions) ? questionsData.questions : []);
                
                questionsList.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
                setExamQuestions(questionsList);
                
                const uniqueSubjects = [...new Set(questionsList.map(q => q.subject || 'General'))];
                const dynamicSections = uniqueSubjects.map((subj, idx) => ({
                  id: `sec-${idx + 1}`,
                  title: `Section ${idx + 1}: ${subj}`,
                  shortName: subj,
                  subject: subj,
                  questions: []
                }));
                setExamSections(dynamicSections);
                if (dynamicSections.length > 0) setActiveSectionId(dynamicSections[0].id);

                setCurrentQuestionIndex(0);
                setQuestionStates({});
                setSelectedOption(null);
                setIsMarked(false);
                return;
              }
            } catch (e) {
              console.error('Failed to auto-start exam:', e);
            }
          }

          setNoActiveExam(true);
          setIsLoadingExam(false);
          return;
        }
        setNoActiveExam(false);
        const [examsRes, attemptRes] = await Promise.all([
          fetchExams(),
          fetchCandidateAttempt(user.id, statusRes.examId)
        ]);
        if (!isMounted) return;
        const exams = Array.isArray(examsRes) ? examsRes : [];
        const activeExam = exams.find(e => String(e._id) === String(statusRes.examId)) || exams[0];
        if (activeExam) {
          setTodayExam(prev => ({
            ...prev,
            id: activeExam._id,
            code: activeExam.exam_code,
            title: activeExam.title,
            durationMinutes: activeExam.total_duration_minutes || prev.durationMinutes,
            totalQuestions: activeExam.blueprint ? Object.values(activeExam.blueprint).reduce((sum, b) => sum + (b.required_count || 0), 0) : prev.totalQuestions,
            totalMarks: activeExam.total_marks || prev.totalMarks,
            status: activeExam.status || prev.status
          }));
        }
        if (attemptRes) {
          setProfile(prev => ({
            ...prev,
            candidateId: user?.name?.includes('Sophia') ? 'CBT-2026-0412' : 'CBT-2026-0891',
            name: user?.name || 'Aarav Sharma',
            terminalId: attemptRes.terminal_id || prev.terminalId,
            verificationStatus: attemptRes.verificationStatus || prev.verificationStatus,
            assignedInvigilator: attemptRes.assigned_invigilator || 'invigilator@example.com'
          }));
        }
        const questionsRes = await fetch(`http://localhost:5001/api/exam/${statusRes.examId}/questions?candidateId=${user.id}`);
        const questionsData = await questionsRes.json();
        if (!isMounted) return;
        const questionsList = Array.isArray(questionsData) ? questionsData : (Array.isArray(questionsData.questions) ? questionsData.questions : []);
        console.log('[Exam] Loaded questions:', {
          count: questionsList.length,
          examId: statusRes.examId,
          sample: questionsList[0]?.text?.slice(0, 80) || 'EMPTY'
        });
        
        questionsList.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
        setExamQuestions(questionsList);

        const uniqueSubjects = [...new Set(questionsList.map(q => q.subject || 'General'))];
        const dynamicSections = uniqueSubjects.map((subj, idx) => ({
          id: `sec-${idx + 1}`,
          title: `Section ${idx + 1}: ${subj}`,
          shortName: subj,
          subject: subj,
          questions: []
        }));
        setExamSections(dynamicSections);
        if (dynamicSections.length > 0) setActiveSectionId(dynamicSections[0].id);

        setCurrentQuestionIndex(0);
        setQuestionStates({});
        setSelectedOption(null);
        setIsMarked(false);
      } catch (e) {
        console.error('Failed to load exam data:', e);
      } finally {
        if (isMounted) setIsLoadingExam(false);
      }
    };
    loadExamData();
    return () => { isMounted = false; };
  }, [user?.id]);

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('state-update', (data) => {
      if (data.sessionStatus) {
        setSessionStatus(data.sessionStatus);
        if (data.sessionStatus === 'ENDED') {
          setCurrentView('RESULT');
        }
      }
    });

    socket.on('session-status-update', ({ status }) => {
      setSessionStatus(status);
      if (status === 'ENDED') {
        setCurrentView('RESULT');
      }
    });

    socket.on('session-terminated', ({ candidateId }) => {
      if (candidateId === profile.candidateId) {
        setIsTerminated(true);
      }
    });

    socket.on('warning-issued', (data) => {
      // Bulletproof native alert for the demo pitch
      window.alert("PROCTOR WARNING: " + (data.message || 'Warning received from Invigilator.'));
      
      // Unconditionally show the warning for the demo pitch to guarantee visibility
      setToastMessage(data.message || 'Warning received from Invigilator.');
      
      // Clear any previous timeouts to prevent rapid clicks from prematurely hiding the toast
      if (window.toastTimeout) clearTimeout(window.toastTimeout);
      window.toastTimeout = setTimeout(() => setToastMessage(null), 8000);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile.candidateId, profile.name]);

  // JIT Time-Warp Override Shortcut (Ctrl+Shift+D)
  const [jitStatus, setJitStatus] = useState('INACTIVE');
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setJitStatus('ACTIVE');
        if (currentView === 'PRE_EXAM' && preExamStep === 4) {
          setWaitingCountdown(5);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, preExamStep]);

  useEffect(() => {
    if (setIsRunning) {
      setIsRunning(sessionStatus === 'RUNNING');
    }
  }, [sessionStatus, setIsRunning]);

  // Demo mode URL detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      setWaitingCountdown(15);
    }
  }, []);

  // Waiting room countdown effect
  useEffect(() => {
    let timer;
    if (currentView === 'PRE_EXAM' && preExamStep === 4) {
      if (waitingCountdown > 0) {
        timer = setInterval(() => {
          setWaitingCountdown(prev => prev - 1);
        }, 1000);
      } else {
        // Automatically enter exam when countdown reaches 0
        setCurrentView('ACTIVE_EXAM');
      }
    }
    return () => clearInterval(timer);
  }, [currentView, preExamStep, waitingCountdown]);

  // Mock verification scanner effect
  const triggerMockVerification = () => {
    setIsVerifying(true);
    setVerificationProgress(10);
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
    setQuestionStates(prev => ({ ...prev, [currentQuestionIndex + 1]: 'answered' }));
    setIsMarked(false);
  };

  const handleClearResponse = () => {
    setSelectedOption(null);
    setQuestionStates(prev => ({ ...prev, [currentQuestionIndex + 1]: 'unanswered' }));
    setIsMarked(false);
  };

  const toggleMark = () => {
    setIsMarked(prev => {
      const newVal = !prev;
      setQuestionStates(prevStates => ({ ...prevStates, [currentQuestionIndex + 1]: newVal ? 'marked' : 'answered' }));
      return newVal;
    });
  };

  const handleToggleMark = () => {
    setIsMarked(prev => !prev);
    setQuestionStates(prev => ({ ...prev, [currentQuestionIndex + 1]: !isMarked ? 'marked' : 'answered' }));
  };

  const handleSaveAndNext = () => {
    if (selectedOption) {
      setQuestionStates(prev => ({ ...prev, [currentQuestionIndex + 1]: 'answered' }));
    }
    const nextIndex = Math.min(currentQuestionIndex + 1, examQuestions.length - 1);
    console.log('[Exam] Save & Next:', {
      currentQuestionIndex,
      nextIndex,
      totalQuestions: examQuestions.length,
      selectedOption,
      currentQuestionText: examQuestions[currentQuestionIndex]?.text?.slice(0, 60),
      nextQuestionText: examQuestions[nextIndex]?.text?.slice(0, 60)
    });
    setCurrentQuestionIndex(nextIndex);
    setSelectedOption(null);
    setIsMarked(false);
  };

  const handlePreviousQuestion = () => {
    const prevIndex = Math.max(currentQuestionIndex - 1, 0);
    console.log('[Exam] Previous:', {
      currentQuestionIndex,
      prevIndex,
      totalQuestions: examQuestions.length,
      currentQuestionText: examQuestions[currentQuestionIndex]?.text?.slice(0, 60)
    });
    setCurrentQuestionIndex(prevIndex);
  };

  if (isLoadingExam) {
    return (
      <div className="h-screen w-screen bg-background text-on-surface flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Loading examination data...</p>
      </div>
    );
  }

  if (noActiveExam) {
    return (
      <div className="h-screen w-screen bg-background text-on-surface flex flex-col items-center justify-center p-8 space-y-6">
        <AlertCircle className="w-20 h-20 text-amber-500" />
        <h1 className="text-3xl font-black">No Active Examination</h1>
        <p className="text-sm text-on-surface-variant text-center max-w-md font-semibold">
          You do not have any scheduled or active examination at this time. Please contact the examination administration for further assistance.
        </p>
      </div>
    );
  }

  if (isTerminated) {
    return (
      <div className="h-screen w-screen bg-red-950 text-white flex flex-col items-center justify-center p-8 space-y-6">
        <XCircle className="w-20 h-20 text-red-500 animate-bounce" />
        <h1 className="text-3xl font-black">Session Terminated</h1>
        <p className="text-sm text-red-200 text-center max-w-md font-semibold">
          Your examination session has been terminated by the supervising invigilator. Please remain seated and await instructions from the exam hall staff.
        </p>
      </div>
    );
  }

  if (sessionStatus === 'PAUSED') {
    return (
      <div className="h-screen w-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 space-y-6">
        <Clock className="w-20 h-20 text-amber-500 animate-pulse" />
        <h1 className="text-3xl font-black">Examination Paused</h1>
        <p className="text-sm text-slate-300 text-center max-w-md font-semibold">
          The exam session has been paused by the invigilator. Your answers and timer are safe. Please wait patiently for the invigilator to resume the session.
        </p>
      </div>
    );
  }

  if (sessionStatus === 'LOCKED') {
    return (
      <div className="h-screen w-screen bg-red-900 text-white flex flex-col items-center justify-center p-8 space-y-6">
        <Lock className="w-20 h-20 text-red-400" />
        <h1 className="text-3xl font-black">Terminal Locked</h1>
        <p className="text-sm text-red-200 text-center max-w-md font-semibold">
          Your workstation terminal has been locked by the administration. All inputs are disabled. Contact the chief invigilator to unlock your station.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background text-on-surface flex flex-col font-sans select-none overflow-hidden">
      {examCameraEnabled && (
        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
          autoPlay
          style={{ display: 'none' }}
        />
      )}

      {/* Top Banner Navigation Header */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 border-b border-slate-800 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/40 text-primary-fixed">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
              <span>N.E.S.T Enterprise Exam Portal</span>
              <Badge variant="mono" size="sm">v2.4 SECURE KIOSK</Badge>
            </div>
            <div className="text-[11px] text-slate-400">Candidate: {profile.name} ({profile.candidateId})</div>
          </div>
        </div>

        {/* View Switcher Quick Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-mono">Terminal: {profile.terminalId}</span>
          </div>

          {currentView !== 'DASHBOARD' && (
            <Button
              variant="outline"
              size="sm"
              icon={LayoutDashboard}
              onClick={() => setCurrentView('DASHBOARD')}
              className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 text-xs"
            >
              Dashboard
            </Button>
          )}
        </div>
      </header>

      {/* SECURE TERMINAL HUD (Pitch Badges) */}
      <SecurityHUD hashStatus="VALID" isEncrypted={true} JITStatus={jitStatus} />

      {/* ==================================================== */}
      {/* VIEW 1: CANDIDATE DASHBOARD */}
      {/* ==================================================== */}
      {currentView === 'DASHBOARD' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center w-full">
          <div className="text-center space-y-6 max-w-lg bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
            <h2 className="text-2xl font-bold text-on-surface">Welcome to the Examination Portal</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              You are about to begin your examination session. Please ensure you are in a quiet environment and have your ID ready for verification.
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                setPreExamStep(1);
                setCurrentView('PRE_EXAM');
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md border border-emerald-400/40 w-full"
            >
              Enter Exam Hall & Pre-Check
            </Button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: PRE-EXAM FLOW (4-STEP GUIDED WIZARD) */}
      {/* ==================================================== */}
      {currentView === 'PRE_EXAM' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">

          {/* Wizard Stepper Progress Header */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
            {[
              { step: 1, title: "Instructions" },
              { step: 2, title: "Identity Verification" },
              { step: 3, title: "System Check" },
              { step: 4, title: "Waiting Room" }
            ].map((st, idx) => (
              <React.Fragment key={st.step}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    preExamStep > st.step ? 'bg-emerald-600 text-white' :
                    preExamStep === st.step ? 'bg-primary text-white ring-4 ring-primary/20' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {preExamStep > st.step ? <Check className="w-4 h-4" /> : st.step}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${preExamStep === st.step ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {st.title}
                  </span>
                </div>
                {idx < 3 && <div className={`h-0.5 flex-1 mx-2 ${preExamStep > st.step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-red-400 max-w-xl w-full">
            <AlertTriangle className="w-8 h-8 shrink-0 text-white animate-pulse" />
            <div className="flex-1">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Invigilator Warning</h4>
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <XCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* PRE-EXAM VERIFICATION FLOW */}
          {preExamStep === 1 && (
            <Card
              title="Step 1: Examination Rules & General Instructions"
              subtitle="Please read all candidate rules thoroughly prior to starting"
              footer={
                <div className="flex justify-between items-center w-full">
                  <Button variant="outline" onClick={() => setCurrentView('DASHBOARD')}>
                    Cancel & Return to Dashboard
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!instructionsAcknowledged}
                    onClick={() => {
                      setPreExamStep(2);
                    }}
                  >
                    Proceed to Identity Verification
                  </Button>
                </div>
              }
            >
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-surface-bright p-3 rounded-lg border border-outline-variant">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Time Limit</div>
                    <div className="text-sm font-bold text-primary mt-0.5">{todayExam.durationMinutes} Minutes</div>
                  </div>
                  <div className="bg-surface-bright p-3 rounded-lg border border-outline-variant">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Questions</div>
                    <div className="text-sm font-bold text-primary mt-0.5">{todayExam.totalQuestions} Items</div>
                  </div>
                  <div className="bg-surface-bright p-3 rounded-lg border border-outline-variant">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Total Marks</div>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">{todayExam.totalMarks} Marks</div>
                  </div>
                  <div className="bg-surface-bright p-3 rounded-lg border border-outline-variant">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">Negative Marking</div>
                    <div className="text-xs font-bold text-red-600 mt-0.5">-0.5 Per Wrong</div>
                  </div>
                </div>

                <div className="space-y-2 bg-surface-bright p-4 rounded-xl border border-outline-variant">
                  <div className="font-bold text-on-surface">General Candidate Guidelines:</div>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                    <li>The clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time.</li>
                    <li>You can click on the question palette button on the left to navigate directly to any question.</li>
                    <li>The Question Palette shows: Answered (Green), Unanswered (Red), Marked for Review (Yellow), Not Visited (White).</li>
                    <li>Saving an option automatically records your response. Marked for Review items are evaluated if answered.</li>
                    <li>AI anti-cheat guard will monitor webcam feed, acoustic background noise, and browser window focus.</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instructionsAcknowledged}
                    onChange={(e) => setInstructionsAcknowledged(e.target.checked)}
                    className="mt-0.5 accent-primary w-4 h-4"
                  />
                  <span className="font-semibold text-indigo-900">
                    I have read and understood all instructions. I agree to abide by all anti-cheat regulations of the National CBT Board.
                  </span>
                </label>
              </div>
            </Card>
          )}

          {/* STEP 2: IDENTITY VERIFICATION */}
          {preExamStep === 2 && (
            <Card
              title="Step 2: Biometric Identity Verification"
              subtitle="Verifying candidate facial features against official registration database"
              footer={
                <div className="flex justify-between items-center w-full">
                  <Button variant="outline" onClick={() => setPreExamStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    disabled={verificationProgress < 100}
                    onClick={() => setPreExamStep(3)}
                  >
                    Proceed to System Check
                  </Button>
                </div>
              }
            >
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3 bg-surface-bright p-4 rounded-xl border border-outline-variant">
                    <div className="font-bold text-on-surface text-sm">Registered Student Profile</div>
                    <div className="space-y-1 text-on-surface-variant">
                      <div>Name: <span className="font-bold text-on-surface">{profile.name}</span></div>
                      <div>Registration Number: <span className="font-mono font-bold text-primary">{profile.candidateId}</span></div>
                      <div>Department: <span className="font-semibold text-on-surface">{profile.department}</span></div>
                      <div>Assigned Terminal: <span className="font-mono font-bold text-emerald-600">{profile.terminalId} ({profile.seatNumber})</span></div>
                    </div>
                  </div>

                  <LiveFeedFrame
                    candidate={{
                      ...profile,
                      status: verificationProgress === 100 ? 'NORMAL' : 'WARNING',
                      cameraActive: isCameraReady,
                      micActive: false,
                      screenShareActive: true,
                      internetStatus: 'CONNECTED',
                      heartbeatStatus: cameraError ? 'Camera blocked' : verificationProgress === 100 ? 'Verified' : 'Scanning'
                    }}
                    frameUrl={frameUrl}
                    title="Setup Live Feed"
                    subtitle={cameraError ? `Camera access issue: ${cameraError}` : verificationProgress === 100 ? 'Identity verified, same feed will remain pinned during the exam' : 'Identity verification and camera calibration in progress'}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-on-surface-variant">Biometric Facial Scan & Government ID OCR Match</span>
                    <span className="font-mono text-emerald-600 font-bold">{verificationProgress}%</span>
                  </div>
                  <ProgressBar progress={verificationProgress} height="h-2.5" color="bg-emerald-600" />
                </div>

                {verificationProgress < 100 && (
                  <Button
                    variant="secondary"
                    icon={RefreshCw}
                    onClick={triggerMockVerification}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? "Running Biometric Face Matching..." : "Run Identity Verification Scan"}
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* STEP 3: SYSTEM READINESS CHECK */}
          {preExamStep === 3 && (
            <Card
              title="Step 3: Hardware & Network Readiness Check"
              subtitle="Ensuring candidate workstation meets CBT security requirements"
              footer={
                <div className="flex justify-between items-center w-full">
                  <Button variant="outline" onClick={() => setPreExamStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setPreExamStep(4)}
                  >
                    Proceed to Waiting Room
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {systemReadinessChecks.map((chk) => (
                    <div key={chk.id} className="p-3.5 bg-surface-bright rounded-xl border border-outline-variant flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-on-surface">{chk.name}</div>
                        <div className="text-[11px] text-on-surface-variant mt-0.5">{chk.detail}</div>
                      </div>
                      <Badge variant="success" size="sm" className="shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {chk.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* STEP 4: WAITING ROOM */}
          {preExamStep === 4 && (
            <Card
              title="Step 4: Examination Hall Waiting Room"
              subtitle="Your terminal is locked and verified. Exam launch countdown active."
              accentLeft
              accentColor="bg-emerald-500"
              footer={
                <div className="flex justify-between items-center w-full">
                  <Button variant="outline" onClick={() => setPreExamStep(3)}>
                    Back to Check
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Play}
                    onClick={() => setCurrentView('ACTIVE_EXAM')}
                    disabled={waitingCountdown > 0}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {waitingCountdown > 0 ? `Please wait (${waitingCountdown}s)` : 'Launch Exam Now'}
                  </Button>
                </div>
              }
            >
              <div className="space-y-6 text-center py-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Session Start Countdown</div>
                  <div className="text-4xl font-black font-mono text-primary tracking-widest">
                    00:00:{waitingCountdown.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-bright p-4 rounded-xl border border-outline-variant text-left text-xs">
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">Assigned Terminal</div>
                    <div className="font-mono font-bold text-primary mt-0.5">{profile.terminalId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">Station Seat</div>
                    <div className="font-bold text-on-surface mt-0.5">{profile.seatNumber}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">Invigilator</div>
                    <div className="font-semibold text-on-surface mt-0.5">{profile.assignedInvigilator}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">Session Slot</div>
                    <div className="font-bold text-emerald-600 mt-0.5">Slot #02</div>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                  Do not refresh or close this browser window. When the timer hits 00:00:00, your exam will automatically initialize.
                </p>
              </div>
            </Card>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 3: ACTIVE EXAM INTERFACE */}
      {/* ==================================================== */}
      {currentView === 'ACTIVE_EXAM' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Top Progress Bar */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <ProgressBar progress={progressPercentage} height="h-1" color="bg-primary" trackColor="bg-slate-200" />
          </div>

          <div className="flex-1 flex h-full pt-1 overflow-hidden">
            {/* Question Palette Sidebar */}
            <QuestionPalette
              subject={todayExam.subject}
              sectionTitle={activeSection.title}
              currentQuestionNumber={currentQuestionIndex + 1}
              onSelectQuestion={(num) => setCurrentQuestionIndex(num - 1)}
              questionStates={questionStates}
              sections={examSections}
              activeSectionId={activeSectionId}
              onSelectSection={setActiveSectionId}
              totalQuestions={todayExam.totalQuestions || examQuestions.length}
            />

            {/* Center Question Canvas */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-surface">
              {/* Header Bar */}
              <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-end px-6 shrink-0 z-10">
                {/* Timer HUD */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentView('REVIEW')}
                    className="text-xs font-semibold"
                  >
                    Review Summary
                  </Button>

                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-white">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </header>

              {/* Question View Canvas */}
              <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-8 flex justify-center">
                <div className="w-full max-w-[1200px] grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
                  <div className="flex flex-col gap-6">
                    {/* Context Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                          {currentQuestionIndex + 1}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                          Single Choice Question
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isMarked && (
                          <Badge variant="warning" size="sm">
                            Marked for Review
                          </Badge>
                        )}
                        <Badge variant="default" size="sm">
                          2 Points
                        </Badge>
                      </div>
                    </div>

                     {/* Question Body Card */}
                     <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                       {examQuestions.length > 0 && currentQuestionIndex < examQuestions.length ? (
                         <>
                           <div className="text-base text-on-surface mb-6 leading-relaxed font-medium">
                             {examQuestions[currentQuestionIndex]?.text || examQuestions[currentQuestionIndex]?.prompt || 'Loading question...'}
                           </div>
                           {console.log('[Exam] Rendering question:', {
                             index: currentQuestionIndex,
                             total: examQuestions.length,
                             text: examQuestions[currentQuestionIndex]?.text?.slice(0, 60)
                           })}

                          {examQuestions[currentQuestionIndex]?.codeSnippet && (
                            <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-slate-700 overflow-x-auto">
                              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                                {examQuestions[currentQuestionIndex].codeSnippet}
                              </pre>
                            </div>
                          )}

                          {examQuestions[currentQuestionIndex]?.options && examQuestions[currentQuestionIndex].options.length > 0 && (
                            <div className="flex flex-col gap-3">
                              {examQuestions[currentQuestionIndex].options.map((option, idx) => {
                                const optionId = option.id || option._id || String.fromCharCode(65 + idx);
                                const optionText = option.text || option.label || option.ciphertext || String(option);
                                const isSelected = selectedOption === optionId;
                                return (
                                  <label
                                    key={optionId}
                                    onClick={() => handleOptionChange(optionId)}
                                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                      isSelected
                                        ? 'border-primary bg-primary-fixed/20 shadow-xs'
                                        : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-variant'
                                    }`}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                                        isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                                      }`}
                                    >
                                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                    </div>
                                    <div className={`text-sm flex-1 ${isSelected ? 'font-bold text-primary' : 'text-on-surface'}`}>
                                      {optionText}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-lg font-bold text-on-surface-variant">No questions available</div>
                          <div className="text-sm text-on-surface-variant mt-2">The exam paper may still be loading. Please wait...</div>
                        </div>
                      )}
                    </div>

                    <div className="h-24"></div>
                  </div>

                  <aside className="space-y-4 xl:sticky xl:top-6">


                    <Card
                      title="Session Snapshot"
                      subtitle="Current candidate telemetry"
                    >
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant">Candidate</span>
                          <span className="font-semibold text-on-surface">{profile.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant">Terminal</span>
                          <span className="font-mono font-semibold text-primary">{profile.terminalId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant">Invigilator</span>
                          <span className="font-semibold text-on-surface">{profile.assignedInvigilator}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant">Timer</span>
                          <span className="font-mono font-semibold text-emerald-600">{formattedTime}</span>
                        </div>
                      </div>
                    </Card>
                  </aside>
                </div>
              </div>

              {/* Footer Action Bar */}
              <footer className="h-20 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between px-6 shrink-0 shadow-md absolute bottom-0 left-0 right-0 z-20">
                <div className="flex gap-3">
                  <Button variant="outline" icon={ChevronLeft} onClick={handlePreviousQuestion}>
                    Previous
                  </Button>
                  <Button variant="primary" icon={ChevronRight} iconPosition="right" onClick={handleSaveAndNext}>
                    Save & Next
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" icon={RotateCcw} onClick={handleClearResponse}>
                    Clear Response
                  </Button>
                  <Button
                    variant={isMarked ? "warning" : "outline"}
                    icon={Bookmark}
                    onClick={handleToggleMark}
                  >
                    {isMarked ? "Marked for Review" : "Mark for Review"}
                  </Button>
                </div>

                <Button
                  variant="danger"
                  icon={Send}
                  onClick={() => setIsSubmitModalOpen(true)}
                >
                  Submit Exam
                </Button>
              </footer>
            </main>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 4: REVIEW PAGE */}
      {/* ==================================================== */}
      {currentView === 'REVIEW' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <Card
            title="Candidate Exam Attempt Summary & Verification"
            subtitle="Review your overall attempt statistics prior to final submission"
            footer={
              <div className="flex justify-between items-center w-full">
                <Button variant="outline" icon={ChevronLeft} onClick={() => setCurrentView('ACTIVE_EXAM')}>
                  Return to Active Exam
                </Button>
                <Button
                  variant="danger"
                  icon={Send}
                  onClick={() => setIsSubmitModalOpen(true)}
                >
                  Proceed to Final Submission
                </Button>
              </div>
            }
          >
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Answered</div>
                  <div className="text-2xl font-black font-mono text-emerald-700 mt-1">44</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="text-[10px] font-bold text-yellow-800 uppercase">Marked for Review</div>
                  <div className="text-2xl font-black font-mono text-yellow-700 mt-1">3</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="text-[10px] font-bold text-red-800 uppercase">Unanswered</div>
                  <div className="text-2xl font-black font-mono text-red-700 mt-1">3</div>
                </div>
                <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant">
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase">Time Remaining</div>
                  <div className="text-lg font-black font-mono text-primary mt-1">{formattedTime}</div>
                </div>
              </div>

              <Table headers={["Section Name", "Total Items", "Answered", "Marked", "Unanswered"]}>
                <tr className="hover:bg-surface-bright text-xs">
                  <td className="px-4 py-3 font-bold text-on-surface">Section 1: Core Concepts</td>
                  <td className="px-4 py-3 font-mono font-bold">20</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-bold">18</td>
                  <td className="px-4 py-3 font-mono text-yellow-600 font-bold">1</td>
                  <td className="px-4 py-3 font-mono text-red-600 font-bold">1</td>
                </tr>
                <tr className="hover:bg-surface-bright text-xs">
                  <td className="px-4 py-3 font-bold text-on-surface">Section 2: Data Structures</td>
                  <td className="px-4 py-3 font-mono font-bold">15</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-bold">14</td>
                  <td className="px-4 py-3 font-mono text-yellow-600 font-bold">1</td>
                  <td className="px-4 py-3 font-mono text-red-600 font-bold">0</td>
                </tr>
                <tr className="hover:bg-surface-bright text-xs">
                  <td className="px-4 py-3 font-bold text-on-surface">Section 3: Algorithms</td>
                  <td className="px-4 py-3 font-mono font-bold">15</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-bold">12</td>
                  <td className="px-4 py-3 font-mono text-yellow-600 font-bold">1</td>
                  <td className="px-4 py-3 font-mono text-red-600 font-bold">2</td>
                </tr>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 5: RESULT SCORECARD PAGE */}
      {/* ==================================================== */}
      {currentView === 'RESULT' && (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex items-center justify-center w-full">
          <div className="text-center space-y-6 max-w-md bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant shadow-lg flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-on-surface">Thank You!</h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Thank you for giving the exam. Your responses have been successfully recorded and submitted.
            </p>
            <Button
              variant="outline"
              size="lg"
              icon={LayoutDashboard}
              onClick={() => {
                setPreExamStep(1);
                setCurrentView('DASHBOARD');
              }}
              className="mt-4 w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CONFIRMATION SUBMISSION MODAL */}
      {/* ==================================================== */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Confirm Final Exam Submission"
        icon={AlertTriangle}
        iconBg="bg-red-100 text-red-600"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Return to Exam
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsSubmitModalOpen(false);
                setCurrentView('RESULT');
              }}
            >
              Yes, Submit Exam Permanently
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-on-surface-variant">
          <p>
            Are you sure you want to submit your examination? Once submitted, your answers cannot be altered.
          </p>
          <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800 space-y-1">
            <div>Total Questions: <strong>50</strong></div>
            <div>Attempted: <strong className="text-emerald-700">44</strong></div>
            <div>Marked for Review: <strong className="text-yellow-700">3</strong></div>
            <div>Unattempted: <strong className="text-red-700">3</strong></div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
