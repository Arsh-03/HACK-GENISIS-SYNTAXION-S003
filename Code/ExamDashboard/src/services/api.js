const BASE_URL = 'http://localhost:5001/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return data;
}

export async function fetchExams() {
  const data = await request('/exams', {
    method: 'GET',
  });
  return Array.isArray(data) ? data : data?.exams ?? data?.data ?? [];
}

export async function fetchExamById(examId) {
  const data = await request(`/exams/${encodeURIComponent(examId)}`, {
    method: 'GET',
  });
  return data?.exam ?? data?.data ?? data;
}

export async function fetchSessions() {
  const data = await request('/sessions', {
    method: 'GET',
  });
  return Array.isArray(data) ? data : data?.sessions ?? data?.data ?? [];
}

export async function fetchCandidateAttempt(userId, examId) {
  const params = new URLSearchParams();
  if (examId !== undefined && examId !== null) {
    params.set('examId', String(examId));
  }
  const query = params.toString();
  const path = `/candidates/${encodeURIComponent(userId)}/attempt${query ? `?${query}` : ''}`;
  const data = await request(path, {
    method: 'GET',
  });
  return data?.attempt ?? data?.data ?? data;
}

export async function syncExamState(payload) {
  const data = await request('/exam/sync-state', {
    method: 'POST',
    body: payload,
  });
  return data;
}

export async function generatePaper(payload) {
  const data = await request('/generate-paper', {
    method: 'POST',
    body: payload,
  });
  return data?.paper ?? data?.data ?? data;
}

export async function fetchQuestions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  const path = `/questions${query ? `?${query}` : ''}`;
  const data = await request(path, {
    method: 'GET',
  });
  return Array.isArray(data) ? data : data?.questions ?? data?.data ?? [];
}

export async function fetchQuestionStats() {
  const data = await request('/questions/stats', {
    method: 'GET',
  });
  return data?.stats ?? data?.data ?? data;
}

export async function fetchDashboardState() {
  const data = await request('/state', {
    method: 'GET',
  });
  return data?.state ?? data?.data ?? data;
}

export async function fetchAdminMetrics() {
  const data = await request('/exam-admin-metrics', {
    method: 'GET',
  });
  return data?.metrics ?? data?.data ?? data;
}

export async function fetchReportsDashboard() {
  const data = await request('/reports/dashboard', {
    method: 'GET',
  });
  return data?.reports ?? data?.dashboard ?? data?.data ?? data;
}

export async function fetchCandidates() {
  const data = await request('/candidates', {
    method: 'GET',
  });
  return Array.isArray(data) ? data : data?.candidates ?? data?.data ?? [];
}

export async function fetchExamStatus(userId) {
  const data = await request(`/exam/status/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
  return data?.status ?? data?.data ?? data;
}

export async function triggerJit(examId) {
  const data = await request(`/api/v1/exam/trigger-jit/${encodeURIComponent(examId)}`, {
    method: 'POST',
  });
  return data;
}

export async function toggleDemoMode() {
  const data = await request('/api/v1/demo/toggle', {
    method: 'POST',
  });
  return data;
}

export async function fetchAiAudit() {
  const data = await request('/api/ai/audit', {
    method: 'GET',
  });
  return Array.isArray(data) ? data : data?.audit ?? data?.data ?? data;
}
