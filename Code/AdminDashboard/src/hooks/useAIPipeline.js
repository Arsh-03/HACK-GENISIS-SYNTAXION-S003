import { useState, useEffect } from 'react';
import {
  mockAIPipelineConfig,
  mockGeneratedPaperQuestions,
  mockAIOpsKPIs,
  mockAIAuditPanel,
  mockAIProviders,
  mockAISystemStatus,
  mockAIGenerationHistory,
  mockAIVisualAnalytics,
  mockAILiveLogs
} from '../services/mockData';

export function useAIPipeline() {
  const [config, setConfig] = useState(mockAIPipelineConfig);
  const [questions, setQuestions] = useState(mockGeneratedPaperQuestions);
  const [activeStageId, setActiveStageId] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(78);
  const [kpis, setKpis] = useState([]);
  const [auditData, setAuditData] = useState(mockAIAuditPanel);
  const [providers, setProviders] = useState(mockAIProviders);
  const [systemStatus, setSystemStatus] = useState(mockAISystemStatus);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(mockAIVisualAnalytics);
  const [liveLogs, setLiveLogs] = useState(mockAILiveLogs);

  // Search & Filter state for History table
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('ALL');

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  // Fetch KPI details dynamically from backend
  const fetchKPIs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/exam-admin-metrics');
      if (res.ok) {
        const data = await res.json();
        setKpis([
          { id: "kpi-1", title: "Active Assigned Sessions", value: String(data.activeSessions), change: "Live", changeType: "increase", description: "Currently running", icon: "Activity", iconBg: "bg-indigo-100 text-indigo-700" },
          { id: "kpi-2", title: "Students Registered", value: data.studentsRegistered.toLocaleString(), change: "+120", changeType: "increase", description: "vs last year", icon: "Users", iconBg: "bg-emerald-100 text-emerald-700" },
          { id: "kpi-3", title: "Active Invigilators", value: String(data.activeInvigilators), change: "Online", changeType: "increase", description: "Monitoring feeds", icon: "Shield", iconBg: "bg-amber-100 text-amber-700" },
          { id: "kpi-4", title: "Next Exam Schedule", value: data.nextExamSchedule, change: data.nextExamSubject, changeType: "increase", description: "Slot 01", icon: "Calendar", iconBg: "bg-blue-100 text-blue-700" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    }
  };

  useEffect(() => {
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 2000);
    return () => clearInterval(interval);
  }, []);

  // Difficulty matrix updater
  const updateDifficulty = (level, val) => {
    setConfig(prev => ({
      ...prev,
      difficultyDistribution: {
        ...prev.difficultyDistribution,
        [level]: val
      }
    }));
  };

  const triggerGeneration = async (mode = 'live') => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setActiveStageId(1);

    const stagesCount = config.stages.length;
    let currentStep = 1;

    // Simulate progress while waiting for backend
    const interval = setInterval(() => {
      if (currentStep < stagesCount - 1) {
        currentStep++;
        setActiveStageId(currentStep);
        setGenerationProgress(Math.min(90, Math.round((currentStep / stagesCount) * 100)));
      }
    }, 1000);

    try {
      const response = await fetch('http://localhost:5001/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode, 
          exam_id: "EXM-2026-CS101", 
          required_counts: { "Medical Entrance": 30, "Chemistry": 20 },
          target_difficulty_distribution: { "Easy": 0.4, "Medium": 0.4, "Hard": 0.2 }
        })
      });
      const data = await response.json();
      
      clearInterval(interval);
      setGenerationProgress(100);
      setActiveStageId(stagesCount);
      setIsGenerating(false);

      if (response.ok) {
        const newPaperId = `PPR-2026-${Math.floor(8000 + Math.random() * 1000)}`;
        const newPaper = {
          paperId: newPaperId,
          title: `${config.subject} Exam Paper (${mode.toUpperCase()})`,
          subject: "Medical Entrance",
          generatedBy: "Live Backend via AI Microservice",
          userRole: "System Automated",
          date: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: "READY",
          generationTime: data.generation_latency_ms ? (data.generation_latency_ms / 1000).toFixed(1) + 's' : "3.8s",
          aiConfidence: data.balance_score ? (data.balance_score * 100).toFixed(1) + '%' : "99.4%",
          validationResult: "PASSED",
          questionsCount: config.questionCount,
          difficultyRatio: `${config.difficultyDistribution.easy}/${config.difficultyDistribution.medium}/${config.difficultyDistribution.hard}`
        };

        setHistory(prev => [newPaper, ...prev]);
        setSelectedPaper(newPaper);
      } else {
        console.error("Generation failed:", data);
        alert("Generation failed: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      clearInterval(interval);
      setIsGenerating(false);
      console.error("Generation error:", e);
      alert("Generation error: " + e.message);
    }
  };

  const triggerPythonPreview = async () => {
    setIsGenerating(true);
    setGenerationProgress(10);
    setActiveStageId(1);
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => Math.min(95, prev + 15));
    }, 300);

    try {
      const response = await fetch('http://localhost:5001/api/run-generate-preview', {
        method: 'POST',
      });
      const data = await response.json();
      clearInterval(interval);
      
      if (response.ok && data.success) {
        setGenerationProgress(100);
        setActiveStageId(11);
        setIsGenerating(false);
        setHistory(prev => [data.paper, ...prev]);
        setSelectedPaper(data.paper);
      } else {
        setIsGenerating(false);
        alert("Python Preview failed: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      clearInterval(interval);
      setIsGenerating(false);
      alert("Python Preview error: " + e.message);
    }
  };

  // Filtered history list
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.paperId.toLowerCase().includes(historySearch.toLowerCase()) ||
                          item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
                          item.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
                          item.generatedBy.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = historyStatusFilter === 'ALL' || item.status === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    config,
    questions,
    activeStageId,
    setActiveStageId,
    isGenerating,
    generationProgress,
    kpis,
    auditData,
    providers,
    systemStatus,
    history: filteredHistory,
    rawHistoryCount: history.length,
    historySearch,
    setHistorySearch,
    historyStatusFilter,
    setHistoryStatusFilter,
    analytics,
    liveLogs,
    updateDifficulty,
    triggerGeneration,
    triggerPythonPreview,

    // Modals
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    isAuditModalOpen,
    setIsAuditModalOpen,
    isLogsOpen,
    setIsLogsOpen,
    selectedPaper,
    setSelectedPaper
  };
}

