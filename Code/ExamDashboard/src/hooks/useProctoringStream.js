import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { fetchDashboardState, fetchCandidates } from '../services/api';

const BACKEND_URL = 'http://localhost:5001';

export function useProctoringStream() {
  const [candidates, setCandidates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [seats, setSeats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [analytics, setAnalytics] = useState({
    alertDistribution: [],
    verificationStatus: [],
    connectivityStatus: [],
    hourlyIncidentTrend: []
  });

  const socketRef = useRef(null);

  // Controls & Navigation
  const [sessionStatus, setSessionStatusInternal] = useState('RUNNING'); // 'RUNNING', 'PAUSED', 'LOCKED', 'ENDED'
  const [activeTab, setActiveTab] = useState('SEAT_MAP'); // 'SEAT_MAP', 'ALERTS', 'INCIDENTS', 'ANALYTICS'
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'CRITICAL', 'WARNING', 'NORMAL', 'OFFLINE'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [messageType, setMessageType] = useState('WARNING'); // 'WARNING', 'REMINDER', 'ATTENTION', 'TECH_DISPATCH'
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  const setSessionStatus = (status) => {
    if (socketRef.current) {
      socketRef.current.emit('update-session-status', { status });
    }
  };

  useEffect(() => {
    // Connect to Socket.io backend
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on('state-update', (data) => {
      if (data.candidates) setCandidates(data.candidates);
      if (data.logs) setLogs(data.logs);
      if (data.kpis) setKpis(data.kpis);
      if (data.seats) setSeats(data.seats);
      if (data.alerts) setAlerts(data.alerts);
      if (data.incidents) setIncidents(data.incidents);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.sessionStatus) setSessionStatusInternal(data.sessionStatus);
    });

    socket.on('session-status-update', ({ status }) => {
      setSessionStatusInternal(status);
    });

    socket.on('warning-issued', ({ candidateName, message, log }) => {
      setLogs(prev => [log, ...prev]);
    });

    socket.on('session-terminated', ({ candidateId, candidateName, log }) => {
      setLogs(prev => [log, ...prev]);
      setCandidates(prev => prev.filter(c => c.id !== candidateId && c.candidateId !== candidateId));
    });

    // Initial fetch of state from backend API
    fetchDashboardState()
      .then(async (data) => {
        if (data.candidates) setCandidates(data.candidates);
        if (data.logs) setLogs(data.logs);
        if (data.kpis) setKpis(data.kpis);
        if (data.seats) setSeats(data.seats);
        if (data.alerts) setAlerts(data.alerts);
        if (data.incidents) setIncidents(data.incidents);
        if (data.analytics) setAnalytics(data.analytics);

        if (!data.candidates || data.candidates.length === 0) {
          try {
            const candidatesData = await fetchCandidates();
            const students = candidatesData.students || candidatesData || [];
            const placeholderCandidates = students.map((s, idx) => ({
              id: s.id || `cand-${idx}`,
              name: s.name,
              candidateId: s.candidateId,
              terminalId: s.session || `TERM-${String(idx + 1).padStart(2, '0')}`,
              seat: `Lab - Station ${idx + 1}`,
              status: 'OFFLINE',
              violationType: null,
              riskScore: 0,
              cameraActive: false,
              micActive: false,
              screenShareActive: false,
              internetStatus: 'DISCONNECTED',
              heartbeatStatus: 'Awaiting feed',
              verificationStatus: s.verificationStatus || 'Pending',
              examProgress: 0,
              answeredCount: 0,
              totalQuestions: 0,
              activityTimeline: []
            }));
            setCandidates(placeholderCandidates);
          } catch (e) {
            console.error('Failed to fetch all candidates:', e);
          }
        }
      })
      .catch(() => undefined);

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredCandidates = candidates.filter(cand => {
    const matchesFilter = filter === 'ALL' || cand.status === filter;
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.seat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (cand.terminalId && cand.terminalId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const terminateSession = (candidateId) => {
    if (socketRef.current) {
      socketRef.current.emit('terminate-session', { candidateId });
    }
  };

  const issueWarning = (candidateName, message) => {
    if (socketRef.current) {
      socketRef.current.emit('issue-warning', { candidateName, message });
    }
  };

  const updateIncidentStatus = (incidentId, newStatus) => {
    if (socketRef.current) {
      socketRef.current.emit('update-incident', { incidentId, newStatus });
    }
  };

  const reassignCandidateSeat = (candidateId, newSeat) => {
    if (socketRef.current) {
      socketRef.current.emit('reassign-seat', { candidateId, newSeat });
    }
  };

  const populateAllCandidates = async () => {
    try {
      const candidatesData = await fetchCandidates();
      const students = candidatesData.students || candidatesData || [];
      const placeholderCandidates = students.map((s, idx) => ({
        id: s.id || `cand-${idx}`,
        name: s.name,
        candidateId: s.candidateId,
        terminalId: s.session || `TERM-${String(idx + 1).padStart(2, '0')}`,
        seat: `Lab - Station ${idx + 1}`,
        status: 'OFFLINE',
        violationType: null,
        riskScore: 0,
        cameraActive: false,
        micActive: false,
        screenShareActive: false,
        internetStatus: 'DISCONNECTED',
        heartbeatStatus: 'Awaiting feed',
        verificationStatus: s.verificationStatus || 'Pending',
        examProgress: 0,
        answeredCount: 0,
        totalQuestions: 0,
        activityTimeline: []
      }));
      setCandidates(placeholderCandidates);
    } catch (e) {
      console.error('Failed to fetch all candidates:', e);
    }
  };

  return {
    candidates: filteredCandidates,
    allCandidates: candidates,
    logs,
    kpis,
    seats,
    alerts,
    incidents,
    analytics,
    sessionStatus,
    setSessionStatus,
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    selectedCandidate,
    setSelectedCandidate,
    isMessagingOpen,
    setIsMessagingOpen,
    messageRecipient,
    setMessageRecipient,
    messageType,
    setMessageType,
    isReassignModalOpen,
    setIsReassignModalOpen,
    terminateSession,
    issueWarning,
    updateIncidentStatus,
    reassignCandidateSeat,
    populateAllCandidates
  };
}

