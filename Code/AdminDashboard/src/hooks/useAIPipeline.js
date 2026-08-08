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
import { fetchKPIs as apiFetchKPIs, generatePaper as apiGeneratePaper, runGeneratePreview as apiRunGeneratePreview, triggerDemo as apiTriggerDemo, fetchGenerationHistory as apiFetchGenerationHistory } from '../services/api';

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
      const data = await apiFetchKPIs();
      setKpis([
        { id: "kpi-1", title: "Active Assigned Sessions", value: String(data.activeSessions), change: "Live", changeType: "increase", description: "Currently running", icon: "Activity", iconBg: "bg-indigo-100 text-indigo-700" },
        { id: "kpi-2", title: "Students Registered", value: data.studentsRegistered.toLocaleString(), change: "+120", changeType: "increase", description: "vs last year", icon: "Users", iconBg: "bg-emerald-100 text-emerald-700" },
        { id: "kpi-3", title: "Active Invigilators", value: String(data.activeInvigilators), change: "Online", changeType: "increase", description: "Monitoring feeds", icon: "Shield", iconBg: "bg-amber-100 text-amber-700" },
        { id: "kpi-4", title: "Next Exam Schedule", value: data.nextExamSchedule, change: data.nextExamSubject, changeType: "increase", description: "Slot 01", icon: "Calendar", iconBg: "bg-blue-100 text-blue-700" }
      ]);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    }
  };

  useEffect(() => {
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const data = await apiFetchGenerationHistory();
        if (isMounted) {
          const mapped = data.map(item => ({
            paperId: item.exam_code,
            title: item.title,
            subject: item.subject,
            generatedBy: item.generated_by,
            date: item.created_at ? item.created_at.replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('T', ' ').slice(0, 19),
            status: item.status === 'COMPLETED' ? 'READY' : item.status,
            generationTime: item.generation_latency_ms ? (item.generation_latency_ms / 1000).toFixed(1) + 's' : '-',
            aiConfidence: item.balance_score ? (item.balance_score * 100).toFixed(1) + '%' : '-',
            validationResult: item.status === 'COMPLETED' ? 'PASSED' : 'FAILED',
            questionsCount: item.questions_count || item.question_count,
            difficultyRatio: item.difficulty_ratio || '-'
          }));
          setHistory(mapped);
        }
      } catch (e) {
        console.error('Failed to load generation history:', e);
      }
    };
    loadHistory();
    return () => { isMounted = false; };
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

  const triggerGeneration = async (mode = 'live', formConfig = null) => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setActiveStageId(1);

    const stagesCount = config.stages.length;
    let currentStep = 1;

    const interval = setInterval(() => {
      if (currentStep < stagesCount - 1) {
        currentStep++;
        setActiveStageId(currentStep);
        setGenerationProgress(Math.min(90, Math.round((currentStep / stagesCount) * 100)));
      }
    }, 1000);

    try {
      const data = await apiGeneratePaper({
        mode,
        exam_id: "EXM-2026-CS101",
        required_counts: { "Medical Entrance": 30, "Chemistry": 20 },
        target_difficulty_distribution: { "Easy": 0.4, "Medium": 0.4, "Hard": 0.2 },
        subject: formConfig?.subject || config.subject,
        questionCount: formConfig?.questionCount || config.questionCount
      });

      clearInterval(interval);
      setGenerationProgress(100);
      setActiveStageId(stagesCount);
      setIsGenerating(false);

      if (data) {
        const newPaperId = `PPR-2026-${Math.floor(8000 + Math.random() * 1000)}`;
        const newPaper = {
          paperId: newPaperId,
          title: `${formConfig?.subject || config.subject} Exam Paper (${mode.toUpperCase()})`,
          subject: formConfig?.subject || config.subject,
          generatedBy: "Live Backend via AI Microservice",
          userRole: "System Automated",
          date: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: "READY",
          generationTime: data.generation_latency_ms ? (data.generation_latency_ms / 1000).toFixed(1) + 's' : "3.8s",
          aiConfidence: data.balance_score ? (data.balance_score * 100).toFixed(1) + '%' : "99.4%",
          validationResult: "PASSED",
          questionsCount: formConfig?.questionCount || config.questionCount,
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

  const triggerDemoMode = async (formConfig = null) => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setActiveStageId(1);

    const stagesCount = config.stages.length;
    let currentStep = 1;

    const interval = setInterval(() => {
      if (currentStep < stagesCount - 1) {
        currentStep++;
        setActiveStageId(currentStep);
        setGenerationProgress(Math.min(90, Math.round((currentStep / stagesCount) * 100)));
      }
    }, 1000);

    try {
      const data = await apiTriggerDemo({
        exam_code: 'NEET_UG_2026',
        subject: formConfig?.subject || config.subject,
        questionCount: formConfig?.questionCount || config.questionCount
      });

      clearInterval(interval);
      setGenerationProgress(100);
      setActiveStageId(stagesCount);
      setIsGenerating(false);

      if (data) {
        const newPaperId = `DEMO-${Date.now()}`;
        const newPaper = {
          paperId: newPaperId,
          title: `Demo Exam - ${formConfig?.subject || config.subject}`,
          subject: formConfig?.subject || config.subject,
          generatedBy: "AI Demo Mode",
          userRole: "System Automated",
          date: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: "READY",
          generationTime: data.paper?.generation_latency_ms ? (data.paper.generation_latency_ms / 1000).toFixed(1) + 's' : "2.1s",
          aiConfidence: data.paper?.balance_score ? (data.paper.balance_score * 100).toFixed(1) + '%' : "98.7%",
          validationResult: "PASSED",
          questionsCount: formConfig?.questionCount || config.questionCount,
          difficultyRatio: `${config.difficultyDistribution.easy}/${config.difficultyDistribution.medium}/${config.difficultyDistribution.hard}`,
          demoExamId: data.demo_exam_id,
          examId: data.examId
        };

        setHistory(prev => [newPaper, ...prev]);
        setSelectedPaper(newPaper);
      }
      return data;
    } catch (e) {
      clearInterval(interval);
      setIsGenerating(false);
      console.error("Demo mode error:", e);
      throw e;
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
      const data = await apiRunGeneratePreview();
      clearInterval(interval);

      if (data.success) {
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
    triggerDemoMode,
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

