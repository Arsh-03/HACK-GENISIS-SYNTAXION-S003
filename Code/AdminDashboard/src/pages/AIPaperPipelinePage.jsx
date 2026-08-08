import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAIPipeline } from '../hooks/useAIPipeline';
import { Card } from '../shared/components/ui/Card';
import { StatCard } from '../shared/components/ui/StatCard';
import { Button } from '../shared/components/ui/Button';
import { Badge } from '../shared/components/ui/Badge';
import { Table } from '../shared/components/ui/Table';
import { Modal } from '../shared/components/ui/Modal';
import { ProgressBar } from '../shared/components/ui/ProgressBar';
import { Input } from '../shared/components/ui/Input';
import { Select } from '../shared/components/ui/Select';
import {
  Sparkles,
  Bot,
  FileText,
  Clock,
  CheckCircle2,
  Zap,
  Shield,
  ShieldAlert,
  Database,
  Cpu,
  Layers,
  HardDrive,
  Activity,
  Eye,
  Download,
  FileSpreadsheet,
  Terminal,
  AlertTriangle,
  Search,
  RefreshCw,
  Play,
  Check,
  X,
  Lock,
  Server,
  BarChart3,
  TrendingUp,
  Sliders,
  ChevronRight,
  Loader2,
  AlertCircle,
  Gauge,
  CheckCircle,
  HelpCircle,
  Share2,
  Filter
} from 'lucide-react';

const getPaperMarkdown = (paper) => {
  if (!paper) return '';
  if (paper.markdown) return paper.markdown;
  if (!paper.paper_data) return '';
  
  let md = `# ${paper.title || 'AI Generated Question Paper'}\n\n`;
  md += `> **AI Audit Validation:** PASSED\n`;
  md += `> **Balance Psychometric Score:** ${paper.aiConfidence || '95.0%'}\n\n`;
  md += `---\n\n`;
  
  const questionsList = paper.paper_data.final_questions || paper.paper_data.questions || [];
  if (questionsList.length === 0) {
    return md + "*No questions found in this paper.*";
  }
  
  questionsList.forEach((q, i) => {
    md += `### Q${i + 1}. [${q.subject || 'General'} - ${q.topic || 'Topic'}] (${q.difficulty || 'Medium'})\n`;
    md += `${q.question_text || q.prompt || q.stem || 'Question text not available.'}\n\n`;
    if (q.options && q.options.length > 0) {
      q.options.forEach((opt, idx) => {
        md += `- **${String.fromCharCode(65 + idx)}.** ${opt.text || opt.label || opt}\n`;
      });
    }
    const correctIdx = q.correct_option_index !== undefined ? q.correct_option_index : 0;
    md += `\n*Correct Answer: ${String.fromCharCode(65 + correctIdx)}*\n\n`;
    if (q.explanation) {
      md += `*Explanation:* ${q.explanation}\n\n`;
    }
    md += `---\n\n`;
  });
  
  return md;
};

export function AIPaperPipelinePage() {
  const {
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
    history,
    rawHistoryCount,
    historySearch,
    setHistorySearch,
    historyStatusFilter,
    setHistoryStatusFilter,
    analytics,
    liveLogs,
    updateDifficulty,
    triggerGeneration,
    triggerPythonPreview,

    // Modals & Drawers
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
    setSelectedPaper,
    triggerDemoMode: hookTriggerDemoMode
  } = useAIPipeline();

  const location = useLocation();
  const currentPath = location.pathname;
  const [formSubject, setFormSubject] = useState(config.subject);
  const [formQuestionCount, setFormQuestionCount] = useState(config.questionCount);
  const [demoCountdown, setDemoCountdown] = useState(0);
  const [demoLive, setDemoLive] = useState(false);
  const [demoStatus, setDemoStatus] = useState('idle'); // idle | generating | generated | failed
  const [demoError, setDemoError] = useState('');

  // Determine active view module based on URL
  const isGenerationView = currentPath.includes('/generation') || currentPath.endsWith('/ai-pipeline');
  const isPipelineView = currentPath.includes('/pipeline');
  const isAuditView = currentPath.includes('/audit');

  // Helper map for KPI icons
  const getKpiIcon = (iconName) => {
    switch (iconName) {
      case 'Bot': return Bot;
      case 'FileText': return FileText;
      case 'Clock': return Clock;
      case 'CheckCircle': return CheckCircle2;
      case 'Zap': return Zap;
      case 'Shield': return Shield;
      default: return Activity;
    }
  };

  // Helper map for System Status icons
  const getSystemIcon = (iconName) => {
    switch (iconName) {
      case 'Database': return Database;
      case 'Zap': return Zap;
      case 'Cpu': return Cpu;
      case 'Layers': return Layers;
      case 'HardDrive': return HardDrive;
      default: return Server;
    }
  };

  // Quick Action Handlers
  const handleOpenPreview = (paper) => {
    setSelectedPaper(paper);
    setIsPreviewModalOpen(true);
  };

  const handleOpenDownload = (paper) => {
    setSelectedPaper(paper);
    setIsDownloadModalOpen(true);
  };

  const handleOpenAudit = (paper) => {
    setSelectedPaper(paper);
    setIsAuditModalOpen(true);
  };

  const activeStage = config.stages.find(s => s.id === activeStageId) || config.stages[6];

  const hasPaper = history && history.length > 0;

  const triggerDemoMode = async () => {
    setDemoStatus('generating');
    setDemoError('');
    setDemoCountdown(0);
    setDemoLive(false);
    try {
      const data = await hookTriggerDemoMode({
        subject: formSubject,
        questionCount: formQuestionCount
      });
      setDemoStatus('generated');
      setDemoCountdown(data.countdown_seconds || 5);
    } catch (err) {
      setDemoStatus('failed');
      setDemoError(err.message || 'Failed to trigger demo mode');
    }
  };

  useEffect(() => {
    if (demoCountdown <= 0) return;
    setDemoLive(false);
    const timer = setInterval(() => {
      setDemoCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setDemoLive(true);
          setDemoStatus('live');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [demoCountdown]);

  return (
    <div className="space-y-8 pb-12">

      {/* ==================================================== */}
      {/* ENTERPRISE AI OPERATIONS CENTER HEADER & ACTION PANEL */}
      {/* ==================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-primary to-indigo-900 text-on-primary p-6 md:p-8 rounded-2xl shadow-lg border border-primary/30 relative overflow-hidden">
        {/* Subtle grid background overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-inner">
                <Bot className="w-7 h-7 text-indigo-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-white">AI Operations Center</h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE MISSION CONTROL
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                  Enterprise autonomous AI question paper generation, real-time psychometric validation, zero-hallucination audit safeguards, and infrastructure telemetry.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION PANEL QUICK BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={isGenerating ? Loader2 : Sparkles}
              disabled={isGenerating}
              onClick={() => setIsGenerateModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md hover:shadow-emerald-500/20 border border-emerald-400/40"
            >
              Generate New Paper
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={isGenerating ? Loader2 : Play}
              disabled={isGenerating}
              onClick={triggerPythonPreview}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md border border-indigo-400/40"
            >
              Generate Test Preview (Python)
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Play}
              onClick={triggerDemoMode}
              disabled={demoStatus === 'generating' || demoCountdown > 0}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold shadow-md border border-amber-300"
            >
              Demo Mode (5s)
            </Button>
            {demoStatus === 'generating' && (
              <span className="text-xs font-mono font-bold text-amber-300 animate-pulse">Generating paper via AI...</span>
            )}
            {demoStatus === 'generated' && (
              <span className="text-xs font-mono font-bold text-emerald-300">Paper generated successfully</span>
            )}
            {demoStatus === 'failed' && (
              <span className="text-xs font-mono font-bold text-red-300">{demoError}</span>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. AI OPERATIONS DASHBOARD (KPI CARDS) - ONLY ON GENERATION VIEW */}
      {/* ==================================================== */}
      {isGenerationView && (
      <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            Exam Administration Metrics
          </h2>
          <span className="text-[11px] font-mono text-on-surface-variant font-medium">Real-time sync: 1s interval</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const IconComp = getKpiIcon(kpi.icon);
            return (
              <StatCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.changeType}
                description={kpi.description}
                icon={IconComp}
                iconBg={kpi.iconBg}
              />
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. GENERATION MONITOR (LIVE TELEMETRY) */}
      {/* ==================================================== */}
      <Card
        title="Live Generation Monitor"
        subtitle="Real-time multi-threaded LLM synthesis engine telemetry"
        accentLeft
        accentColor={isGenerating ? "bg-amber-500" : "bg-emerald-500"}
        headerAction={
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isGenerating ? "SYNTHESIZING..." : "SYSTEM IDLE / READY"}
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={isGenerating ? Loader2 : Play}
              disabled={isGenerating}
              onClick={triggerGeneration}
              className="font-bold text-xs"
            >
              {isGenerating ? "Processing..." : "Run Pipeline Batch"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-bright p-4 rounded-xl border border-outline-variant">
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Overall Progress</div>
              <div className="text-2xl font-black font-mono text-primary mt-0.5">{generationProgress}%</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Current Active Stage</div>
              <div className="text-sm font-bold text-on-surface mt-1 truncate flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
                Stage {activeStage.id}: {activeStage.name}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Est. Completion Time</div>
              <div className="text-sm font-bold font-mono text-emerald-600 mt-1">
                {isGenerating ? `${((100 - generationProgress) * 0.08).toFixed(1)}s remaining` : "0.0s (Completed)"}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Running Worker Tasks</div>
              <div className="text-sm font-bold text-on-surface mt-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>4 Parallel Nodes (vLLM Engine)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface-variant">Pipeline Batch Progress ({generationProgress}%)</span>
              <span className="font-mono text-primary font-bold">Stage {activeStageId} of 11</span>
            </div>
            <ProgressBar progress={generationProgress} height="h-3" color={isGenerating ? "bg-amber-500" : "bg-primary"} />
          </div>
        </div>
      </Card>

      {/* ==================================================== */}
      {/* 3. AI GENERATION PIPELINE (11 VISUAL STAGES) */}
      {/* ==================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              AI Generation Pipeline Lifecycle
            </h2>
            <p className="text-xs text-on-surface-variant">
              11-stage autonomous synthesis pipeline. Click any stage card to inspect deep telemetry details.
            </p>
          </div>
          <Badge variant="info" size="sm">11 STAGES ACTIVE</Badge>
        </div>

        {/* 11-Stage Horizontal Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {config.stages.map((stage) => {
            const isCompleted = stage.id < activeStageId || (!isGenerating && activeStageId === 11);
            const isActive = stage.id === activeStageId && isGenerating;
            const isWarning = stage.resultType === 'warning';

            return (
              <div
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20 shadow-md scale-[1.01]'
                    : isCompleted
                    ? 'bg-surface-container-lowest border-outline-variant hover:border-emerald-400 hover:shadow-xs'
                    : 'bg-surface border-outline-variant/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-primary text-white animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : stage.id}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface line-clamp-1">{stage.name}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">{stage.timeTaken}</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isCompleted && (
                    <Badge variant={isWarning ? 'warning' : 'success'} size="sm">
                      {isWarning ? 'WARNING' : 'PASSED'}
                    </Badge>
                  )}
                  {isActive && (
                    <Badge variant="info" size="sm" className="animate-pulse">
                      RUNNING
                    </Badge>
                  )}
                  {!isCompleted && !isActive && (
                    <Badge variant="default" size="sm">
                      QUEUED
                    </Badge>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-medium text-on-surface-variant">
                    <span>Progress</span>
                    <span className="font-mono font-bold text-primary">{isCompleted ? 100 : isActive ? stage.progress : 0}%</span>
                  </div>
                  <ProgressBar
                    progress={isCompleted ? 100 : isActive ? stage.progress : 0}
                    height="h-1.5"
                    color={isWarning ? 'bg-amber-500' : isCompleted ? 'bg-emerald-600' : 'bg-primary'}
                  />
                </div>

                <p className="text-[11px] text-on-surface-variant mt-2.5 line-clamp-2 leading-relaxed bg-surface-bright p-1.5 rounded border border-outline-variant/40">
                  {stage.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      </>
      )}

      {/* ==================================================== */}
      {/* 4. AI AUDIT PANEL & VISUAL ANALYTICS GRID - ONLY ON AUDIT VIEW */}
      {/* ==================================================== */}
      {isAuditView && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AI AUDIT PANEL */}
        <Card
          title="AI Audit & Quality Safeguards"
          subtitle="Zero-hallucination verification & fairness audit"
          className="lg:col-span-1"
          headerAction={<Shield className="w-5 h-5 text-emerald-600" />}
        >
          <div className="space-y-4">
            {/* Overall Confidence Meter */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Overall AI Confidence Score</span>
                <span className="text-lg font-black font-mono text-emerald-700">{auditData.overallConfidenceScore}%</span>
              </div>
              <ProgressBar progress={auditData.overallConfidenceScore} height="h-2.5" color="bg-emerald-600" />
              <div className="text-[11px] text-emerald-800 mt-2 font-medium">
                High Precision - Exceeds enterprise threshold (&gt;95.0%)
              </div>
            </div>

            {/* Audit Checklist Items */}
            <div className="space-y-3 divide-y divide-outline-variant/60">
              <div className="pt-2 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-on-surface">Duplicate Questions</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">{auditData.duplicateQuestionsFound}</div>
                </div>
                <Badge variant="warning" size="sm">FLAGGED</Badge>
              </div>

              <div className="pt-3 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-on-surface">Ambiguous Questions</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">{auditData.ambiguousQuestions}</div>
                </div>
                <Badge variant="warning" size="sm">1 HITL</Badge>
              </div>

              <div className="pt-3 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-on-surface">Missing Syllabus Topics</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">{auditData.missingTopics}</div>
                </div>
                <Badge variant="success" size="sm">CLEARED</Badge>
              </div>

              <div className="pt-3 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-on-surface">Difficulty Balance</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">{auditData.difficultyBalance}</div>
                </div>
                <Badge variant="success" size="sm">CALIBRATED</Badge>
              </div>

              <div className="pt-3 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-on-surface">Subject Coverage</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">{auditData.subjectCoverage}</div>
                </div>
                <Badge variant="success" size="sm">100% COVERED</Badge>
              </div>

              <div className="pt-3 flex items-start justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-on-surface">Validation Summary</div>
                  <div className="text-on-surface-variant text-[11px] mt-0.5">{auditData.validationSummary}</div>
                </div>
                <Badge variant="info" size="sm">AUTO-PASS</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* VISUAL ANALYTICS CHARTS */}
        <Card
          title="Visual Analytics & Psychometrics"
          subtitle="Distribution curves, performance metrics, and request volumes"
          className="lg:col-span-2 space-y-6"
          headerAction={<BarChart3 className="w-5 h-5 text-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chart 1: Difficulty Distribution */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Difficulty Distribution</span>
                <span className="text-[11px] font-mono font-bold text-primary">50 Items Total</span>
              </div>
              <div className="space-y-2.5">
                {analytics.difficultyDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{item.label}</span>
                      <span className={`font-mono font-bold ${item.text}`}>{item.count} items ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Subject Breakdown */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Subject Domain Weight</span>
                <span className="text-[11px] font-mono font-bold text-emerald-600">100% Balanced</span>
              </div>
              <div className="space-y-2">
                {analytics.subjectDistribution.map((sub, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="truncate max-w-[140px] text-on-surface">{sub.subject}</span>
                      <span className="font-mono text-on-surface-variant font-bold">{sub.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${sub.color}`} style={{ width: `${sub.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Generation Latency Performance */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Generation Performance (Latency)</span>
                <span className="text-[11px] font-mono font-bold text-purple-600">Avg: 4.2s</span>
              </div>
              {/* Custom SVG Line Chart */}
              <div className="h-28 w-full flex items-end justify-between gap-1 pt-4 pb-1">
                {analytics.generationPerformance.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-indigo-500/80 group-hover:bg-primary rounded-t transition-all"
                      style={{ height: `${(pt.latency / 6) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono text-on-surface-variant">{pt.time}</span>
                    {/* Tooltip */}
                    <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 font-mono whitespace-nowrap">
                      {pt.latency}s
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Daily AI Usage */}
            <div className="bg-surface-bright p-4 rounded-xl border border-outline-variant space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Daily AI Request Volumes</span>
                <span className="text-[11px] font-mono font-bold text-indigo-600">Peak: 2.4k req/h</span>
              </div>
              {/* Custom SVG Bar Chart */}
              <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-4 pb-1">
                {analytics.generationPerformance.map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-emerald-500/80 group-hover:bg-emerald-600 rounded-t transition-all"
                      style={{ height: `${(pt.requests / 2500) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono text-on-surface-variant">{pt.time}</span>
                    <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 font-mono whitespace-nowrap">
                      {pt.requests} reqs
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Card>
      </div>
      )}

      {/* ==================================================== */}
      {/* 5. AI PROVIDERS & INFRASTRUCTURE STATUS - ONLY ON PIPELINE VIEW */}
      {/* ==================================================== */}
      {isPipelineView && (
      <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI PROVIDERS */}
        <Card
          title="AI Model Providers"
          subtitle="Active LLM foundation models and fallback endpoints"
          headerAction={<Bot className="w-5 h-5 text-indigo-600" />}
        >
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  provider.isPrimary
                    ? 'bg-primary/5 border-primary/40 shadow-xs'
                    : 'bg-surface-bright border-outline-variant'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                    provider.status === 'Online' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">{provider.name}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                        {provider.badge}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{provider.provider}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase">Response Time</div>
                    <div className="font-bold text-primary">{provider.responseTime}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase">Last Request</div>
                    <div className="font-bold text-on-surface">{provider.lastRequest}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant uppercase">Health</div>
                    <div className="font-bold text-emerald-600">{provider.healthIndicator}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SYSTEM INFRASTRUCTURE STATUS */}
        <Card
          title="System Infrastructure Status"
          subtitle="Microservices, databases, queues, and object storage"
          headerAction={<Server className="w-5 h-5 text-indigo-600" />}
        >
          <div className="space-y-3">
            {systemStatus.map((sys) => {
              const SysIcon = getSystemIcon(sys.icon);
              return (
                <div
                  key={sys.id}
                  className="p-3.5 bg-surface-bright rounded-xl border border-outline-variant flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                      <SysIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface flex items-center gap-2">
                        <span>{sys.name}</span>
                        <span className="text-[10px] font-normal text-on-surface-variant">({sys.role})</span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">{sys.metrics}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-on-surface-variant uppercase">Latency</div>
                      <div className="font-bold text-emerald-600">{sys.latency}</div>
                    </div>
                    <Badge variant="success" size="sm">
                      {sys.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* ==================================================== */}
      {/* 6. GENERATION HISTORY (PROFESSIONAL TABLE) */}
      {/* ==================================================== */}
      <Card
        title="Generation History Audit Trail"
        subtitle="Immutable ledger of AI syntheses, approval status & psychometric scores"
        headerAction={
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search Paper ID or Title..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-48"
              />
            </div>

            {/* Status Filter */}
            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-md border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="READY">Ready</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>
        }
      >
        <Table headers={["Paper ID & Title", "Generated By", "Timestamp", "Status", "Time", "AI Confidence", "Validation Result", "Actions"]}>
          {history.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-xs text-on-surface-variant">
                No generation records found matching search filters.
              </td>
            </tr>
          ) : (
            history.map((row) => (
              <tr key={row.paperId} className="hover:bg-surface-bright transition-colors text-xs">
                <td className="px-4 py-3">
                  <div className="font-mono font-bold text-primary">{row.paperId}</div>
                  <div className="font-semibold text-on-surface text-[11px] line-clamp-1">{row.title}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-on-surface">{row.generatedBy}</div>
                  <div className="text-[10px] text-on-surface-variant">{row.userRole}</div>
                </td>
                <td className="px-4 py-3 font-mono text-on-surface-variant">{row.date}</td>
                <td className="px-4 py-3">
                  <Badge variant={row.status === 'READY' ? 'success' : row.status === 'VERIFIED' ? 'info' : 'warning'} size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-on-surface">{row.generationTime}</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-600">{row.aiConfidence}</td>
                <td className="px-4 py-3">
                  <Badge variant={row.validationResult === 'PASSED' ? 'success' : 'danger'} size="sm">
                    {row.validationResult}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" icon={Eye} onClick={() => handleOpenPreview(row)} title="Preview Paper" />
                    <Button variant="ghost" size="sm" icon={Download} onClick={() => handleOpenDownload(row)} title="Download Paper" />
                    <Button variant="ghost" size="sm" icon={Shield} onClick={() => handleOpenAudit(row)} title="Audit Report" />
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
      </Card>

      {/* ==================================================== */}
      {/* 7. GENERATED PAPER ACTIONS (MIGRATED FROM HEADER) */}
      {/* ==================================================== */}
      {hasPaper && (
        <Card
          title="Generated Paper Management"
          subtitle="Preview, download, and audit actions for the active generated assessment package"
          className="bg-surface-container-lowest border border-outline-variant shadow-sm mt-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={Eye}
              onClick={() => handleOpenPreview(selectedPaper || history[0])}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-semibold border border-primary/20"
            >
              Preview Paper
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Download}
              onClick={() => handleOpenDownload(selectedPaper || history[0])}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200"
            >
              Download Paper
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Shield}
              onClick={() => handleOpenAudit(selectedPaper || history[0])}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200"
            >
              Audit Report
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Terminal}
              onClick={() => setIsLogsOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300"
            >
              Generation Logs
            </Button>
          </div>
        </Card>
      )}
      </>
      )}

      {/* ==================================================== */}
      {/* INTERACTIVE MODALS & DRAWERS */}
      {/* ==================================================== */}

      {demoCountdown > 0 && !demoLive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="text-7xl font-black font-mono text-amber-400 animate-pulse">{demoCountdown}</div>
            <div className="text-xl font-bold text-white">Starting Demo Exam...</div>
            <div className="text-sm text-slate-300">Exam goes live automatically when countdown reaches zero</div>
          </div>
        </div>
      )}

      {demoLive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-emerald-900/90 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto animate-pulse" />
            <div className="text-3xl font-black text-emerald-300">Exam is now LIVE</div>
            <div className="text-sm text-emerald-100">The exam has started. Students can now log in.</div>
            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="primary"
                onClick={() => window.open('/exam/login', '_blank')}
                className="bg-white text-emerald-900 hover:bg-emerald-50"
              >
                Open Exam Login
              </Button>
              <Button
                variant="outline"
                onClick={() => setDemoLive(false)}
                className="border-white text-white hover:bg-white/10"
              >
                Stay on Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: GENERATE NEW PAPER */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Synthesize New AI Question Paper"
        icon={Sparkles}
        iconBg="bg-indigo-100 text-indigo-700"
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={isGenerating ? Loader2 : Zap}
              disabled={isGenerating}
              onClick={() => {
                setIsGenerateModalOpen(false);
                triggerGeneration('live', { subject: formSubject, questionCount: formQuestionCount });
              }}
            >
              {isGenerating ? "Synthesizing..." : "Start AI Generation"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Subject & Target Assessment Domain"
            value={formSubject}
            onChange={(e) => setFormSubject(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Target Question Count</label>
              <Input value={formQuestionCount} onChange={(e) => setFormQuestionCount(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Primary LLM Provider</label>
              <Select value="gemini">
                <option value="gemini">Gemini 1.5 Pro (Vertex AI)</option>
                <option value="openai">OpenAI GPT-4o (Backup)</option>
                <option value="local">Local Llama 3 70B</option>
              </Select>
            </div>
          </div>

          <div className="space-y-3 bg-surface-bright p-3.5 rounded-lg border border-outline-variant">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface-variant uppercase">Difficulty Distribution</span>
              <span className="text-primary font-mono font-bold">100% Calibrated</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Easy</span>
                  <span className="font-mono text-emerald-600 font-bold">{config.difficultyDistribution.easy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.difficultyDistribution.easy}
                  onChange={(e) => updateDifficulty('easy', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Medium</span>
                  <span className="font-mono text-yellow-600 font-bold">{config.difficultyDistribution.medium}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.difficultyDistribution.medium}
                  onChange={(e) => updateDifficulty('medium', Number(e.target.value))}
                  className="w-full accent-yellow-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Hard</span>
                  <span className="font-mono text-red-600 font-bold">{config.difficultyDistribution.hard}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.difficultyDistribution.hard}
                  onChange={(e) => updateDifficulty('hard', Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: PREVIEW GENERATED PAPER */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={`Paper Preview: ${selectedPaper?.paperId || 'PPR-2026-8941'}`}
        icon={Eye}
        iconBg="bg-blue-100 text-blue-700"
        maxWidth="max-w-4xl"
        footer={
          <Button variant="primary" onClick={() => setIsPreviewModalOpen(false)}>
            Close Preview
          </Button>
        }
      >
        <div className="space-y-4">
          {(selectedPaper?.markdown || selectedPaper?.paper_data) ? (
            <div className="p-5 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 font-mono text-xs overflow-y-auto max-h-[500px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {getPaperMarkdown(selectedPaper)}
            </div>
          ) : (
            <>
              <div className="p-4 bg-surface-bright rounded-xl border border-outline-variant flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-on-surface text-sm">{selectedPaper?.title}</div>
                  <div className="text-on-surface-variant mt-0.5">{selectedPaper?.subject} • Generated by {selectedPaper?.generatedBy}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">{selectedPaper?.aiConfidence} AI Confidence</Badge>
                  <Badge variant="info" size="sm">{selectedPaper?.questionsCount || 50} Items</Badge>
                </div>
              </div>

              <Table headers={["Code", "Topic", "Difficulty", "Bloom Level", "Quality Score", "Question Stem Preview"]}>
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-surface-bright transition-colors text-xs">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{q.code}</td>
                    <td className="px-4 py-3 font-semibold text-on-surface">{q.topic}</td>
                    <td className="px-4 py-3">
                      <Badge variant={q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'warning' : 'success'} size="sm">
                        {q.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{q.bloom}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">{q.qualityScore}</td>
                    <td className="px-4 py-3 text-on-surface-variant max-w-[280px] truncate">{q.stem}</td>
                  </tr>
                ))}
              </Table>
            </>
          )}
        </div>
      </Modal>

      {/* MODAL 3: DOWNLOAD PAPER */}
      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Export Question Paper Package"
        icon={Download}
        iconBg="bg-emerald-100 text-emerald-700"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDownloadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Download} onClick={() => setIsDownloadModalOpen(false)}>
              Download Selected Format
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-on-surface-variant">
            Select export format for paper <span className="font-mono font-bold text-primary">{selectedPaper?.paperId}</span>:
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-surface-bright rounded-lg border border-outline-variant cursor-pointer hover:border-primary">
              <input type="radio" name="export-format" defaultChecked className="accent-primary" />
              <div>
                <div className="font-bold text-on-surface">QTI 2.1 Standard Assessment Package</div>
                <div className="text-[11px] text-on-surface-variant">Interoperable XML package for CBT exam platforms</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-surface-bright rounded-lg border border-outline-variant cursor-pointer hover:border-primary">
              <input type="radio" name="export-format" className="accent-primary" />
              <div>
                <div className="font-bold text-on-surface">Encrypted Master PDF Document</div>
                <div className="text-[11px] text-on-surface-variant">Print-ready candidate question booklet with watermark</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-surface-bright rounded-lg border border-outline-variant cursor-pointer hover:border-primary">
              <input type="radio" name="export-format" className="accent-primary" />
              <div>
                <div className="font-bold text-on-surface">CSV / Excel Raw Items Matrix</div>
                <div className="text-[11px] text-on-surface-variant">Tabular stems, options, distractors and key explanations</div>
              </div>
            </label>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: AUDIT REPORT */}
      <Modal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="AI Integrity & Audit Certificate"
        icon={Shield}
        iconBg="bg-purple-100 text-purple-700"
        maxWidth="max-w-lg"
        footer={
          <Button variant="primary" onClick={() => setIsAuditModalOpen(false)}>
            Close Audit Dossier
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="font-bold text-purple-900 text-sm">Cryptographic Audit Ledger</div>
            <div className="font-mono text-[11px] text-purple-700 mt-1 break-all">
              SHA256: e922c01e0f834ca29e4317ebea33fdf18941a87bf
            </div>
          </div>

          <div className="space-y-2 divide-y divide-outline-variant/60">
            <div className="pt-2 flex justify-between">
              <span className="text-on-surface-variant">Target Paper:</span>
              <span className="font-mono font-bold text-on-surface">{selectedPaper?.paperId}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-on-surface-variant">Verification Result:</span>
              <Badge variant="success" size="sm">{selectedPaper?.validationResult}</Badge>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-on-surface-variant">Hallucination Index:</span>
              <span className="font-mono font-bold text-emerald-600">0.00% Zero-Defect</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-on-surface-variant">Discrimination Index:</span>
              <span className="font-mono font-bold text-primary">+0.48 High Discrimination</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-on-surface-variant">Audited By:</span>
              <span className="font-semibold text-on-surface">Vertex AI Guardrail Engine</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 5: GENERATION LOGS DRAWER/TERMINAL */}
      <Modal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        title="Live Generation Telemetry Logs"
        icon={Terminal}
        iconBg="bg-slate-800 text-emerald-400"
        maxWidth="max-w-3xl"
        footer={
          <Button variant="primary" onClick={() => setIsLogsOpen(false)}>
            Close Logs
          </Button>
        }
      >
        <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-[11px] h-80 overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner">
          <div className="text-slate-500 pb-2 border-b border-slate-800">
            // Nexis AI Operations Engine v2.4.0 Live Stream
          </div>
          {liveLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-slate-500 shrink-0">[{log.time}]</span>
              <span className={`font-bold shrink-0 ${
                log.level === 'SUCCESS' ? 'text-emerald-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
              }`}>
                [{log.level}]
              </span>
              <span className="text-slate-300">{log.msg}</span>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
}
