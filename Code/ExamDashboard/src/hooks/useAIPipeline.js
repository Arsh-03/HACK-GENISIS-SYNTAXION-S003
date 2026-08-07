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
  const [kpis, setKpis] = useState(mockAIOpsKPIs);
  const [auditData, setAuditData] = useState(mockAIAuditPanel);
  const [providers, setProviders] = useState(mockAIProviders);
  const [systemStatus, setSystemStatus] = useState(mockAISystemStatus);
  const [history, setHistory] = useState(mockAIGenerationHistory);
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
  const [selectedPaper, setSelectedPaper] = useState(mockAIGenerationHistory[0]);

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

  // Live generation simulation across 11 stages
  const triggerGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setActiveStageId(1);

    const stagesCount = config.stages.length;
    let currentStep = 1;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= stagesCount) {
        setActiveStageId(currentStep);
        setGenerationProgress(Math.min(98, Math.round((currentStep / stagesCount) * 100)));

        // Append real-time simulation log
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
        setLiveLogs(prev => [
          ...prev,
          {
            id: `log-${Date.now()}`,
            time: timestamp,
            level: "INFO",
            source: config.stages[currentStep - 1].name.toUpperCase().replace(/\s+/g, '_'),
            msg: `[Stage ${currentStep}] Processing stage: ${config.stages[currentStep - 1].name}...`
          }
        ]);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setGenerationProgress(100);
        setActiveStageId(11);

        // Update history with new paper
        const newPaperId = `PPR-2026-${Math.floor(8000 + Math.random() * 1000)}`;
        const newPaper = {
          paperId: newPaperId,
          title: `${config.subject} Exam Paper`,
          subject: "Computer Science",
          generatedBy: "Gemini 1.5 Pro AI",
          userRole: "System Automated",
          date: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: "READY",
          generationTime: "3.8s",
          aiConfidence: "99.4%",
          validationResult: "PASSED",
          questionsCount: config.questionCount,
          difficultyRatio: `${config.difficultyDistribution.easy}/${config.difficultyDistribution.medium}/${config.difficultyDistribution.hard}`
        };

        setHistory(prev => [newPaper, ...prev]);
        setSelectedPaper(newPaper);
      }
    }, 600);
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

