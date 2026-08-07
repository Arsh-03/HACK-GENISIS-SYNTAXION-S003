import { useState } from 'react';
import {
  mockCandidates,
  mockViolationLogs,
  mockProctoringOverviewKPIs,
  mockExamHallSeats,
  mockLiveAlerts,
  mockIncidents,
  mockProctoringAnalytics
} from '../services/mockData';

export function useProctoringStream() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [logs, setLogs] = useState(mockViolationLogs);
  const [kpis, setKpis] = useState(mockProctoringOverviewKPIs);
  const [seats, setSeats] = useState(mockExamHallSeats);
  const [alerts, setAlerts] = useState(mockLiveAlerts);
  const [incidents, setIncidents] = useState(mockIncidents);
  const [analytics, setAnalytics] = useState(mockProctoringAnalytics);

  // Controls & Navigation
  const [sessionStatus, setSessionStatus] = useState('RUNNING'); // 'RUNNING', 'PAUSED', 'LOCKED', 'ENDED'
  const [activeTab, setActiveTab] = useState('GRID'); // 'GRID', 'SEAT_MAP', 'ALERTS', 'INCIDENTS', 'ANALYTICS'
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'CRITICAL', 'WARNING', 'NORMAL', 'OFFLINE'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);
  const [messageType, setMessageType] = useState('WARNING'); // 'WARNING', 'REMINDER', 'ATTENTION', 'TECH_DISPATCH'
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  const filteredCandidates = candidates.filter(cand => {
    const matchesFilter = filter === 'ALL' || cand.status === filter;
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.seat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (cand.terminalId && cand.terminalId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const terminateSession = (candidateId) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: `log-${Date.now()}`,
        time: timestamp,
        candidate: candidateId,
        type: 'CRITICAL',
        text: `Invigilator manually terminated exam session for candidate ${candidateId}.`
      },
      ...prev
    ]);
  };

  const issueWarning = (candidateName, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: `log-${Date.now()}`,
        time: timestamp,
        candidate: candidateName,
        type: 'WARNING',
        text: `Official warning issued to ${candidateName}: ${message}`
      },
      ...prev
    ]);
  };

  const updateIncidentStatus = (incidentId, newStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));
  };

  const reassignCandidateSeat = (candidateId, newSeat) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId || c.candidateId === candidateId) {
        return { ...c, seat: newSeat };
      }
      return c;
    }));
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
    reassignCandidateSeat
  };
}

