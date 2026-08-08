const BACKEND_URL = 'http://localhost:5001';

export async function fetchKPIs() {
  const res = await fetch(`${BACKEND_URL}/api/exam-admin-metrics`);
  if (!res.ok) throw new Error('Failed to fetch KPIs');
  return res.json();
}

export async function generatePaper({ mode, exam_id, required_counts, target_difficulty_distribution, subject, questionCount }) {
  const res = await fetch(`${BACKEND_URL}/api/generate-paper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      exam_id: exam_id || 'EXM-2026-CS101',
      required_counts: required_counts || { "Medical Entrance": 30, "Chemistry": 20 },
      target_difficulty_distribution: target_difficulty_distribution || { "Easy": 0.4, "Medium": 0.4, "Hard": 0.2 }
    })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate paper');
  }
  return res.json();
}

export async function triggerDemo({ exam_code, subject, questionCount }) {
  const res = await fetch(`${BACKEND_URL}/api/demo/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exam_code, subject, questionCount })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to trigger demo mode');
  }
  return res.json();
}

export async function runGeneratePreview() {
  const res = await fetch(`${BACKEND_URL}/api/run-generate-preview`, {
    method: 'POST'
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to run preview');
  }
  return res.json();
}

export async function fetchGenerationHistory() {
  const res = await fetch(`${BACKEND_URL}/api/generation-history`);
  if (!res.ok) throw new Error('Failed to fetch generation history');
  return res.json();
}
