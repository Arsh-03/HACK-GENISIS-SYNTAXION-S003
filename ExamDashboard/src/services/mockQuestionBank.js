// Mock Question Bank Service for Nexis CBT Platform

export const INITIAL_QUESTIONS = [
  {
    id: 'Q-2026-0101',
    title: 'Time Complexity of Binary Search Algorithm',
    prompt: 'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (BST) with N nodes?',
    options: [
      { id: 'opt-a', text: 'O(1)', isCorrect: false },
      { id: 'opt-b', text: 'O(log N)', isCorrect: true },
      { id: 'opt-c', text: 'O(N)', isCorrect: false },
      { id: 'opt-d', text: 'O(N log N)', isCorrect: false }
    ],
    correctAnswerText: 'O(log N)',
    explanation: 'In a balanced BST, the height of the tree is log N. In the worst case, binary search traverses from the root to a leaf node, taking O(log N) comparisons.',
    subject: 'Computer Science',
    topic: 'Data Structures & Algorithms',
    chapter: 'Trees & Search Graphs',
    difficulty: 'Medium',
    marks: 2,
    type: 'Multiple Choice',
    source: 'Manual',
    status: 'Active',
    version: 'v1.2',
    lastUpdated: '2026-08-01',
    bloomsTaxonomy: 'Analyze',
    tags: ['algorithms', 'binary-search', 'data-structures'],
    imageUrl: null,
    versionHistory: [
      { version: 'v1.0', date: '2026-07-15', author: 'Dr. Sarah Jenkins', comment: 'Initial question creation' },
      { version: 'v1.1', date: '2026-07-20', author: 'Marcus Vance', comment: 'Updated explanation clarity' },
      { version: 'v1.2', date: '2026-08-01', author: 'Admin Proctor', comment: 'Approved for CBT deployment' }
    ]
  },
  {
    id: 'Q-2026-0102',
    title: 'Properties of Convolutional Neural Networks',
    prompt: 'Which of the following architectural properties are characteristic of Convolutional Neural Networks (CNNs)? Select all that apply.',
    options: [
      { id: 'opt-a', text: 'Local receptive fields (Shared weights across spatial locations)', isCorrect: true },
      { id: 'opt-b', text: 'Spatial translation invariance via pooling operations', isCorrect: true },
      { id: 'opt-c', text: 'Full pairwise connectivity between all input and output neurons', isCorrect: false },
      { id: 'opt-d', text: 'Feature map extraction using learned filter kernels', isCorrect: true }
    ],
    correctAnswerText: 'Options A, B, and D',
    explanation: 'CNNs rely on local receptive fields, weight sharing, and pooling for spatial translation invariance. They are sparsely connected, unlike fully connected dense layers.',
    subject: 'Artificial Intelligence',
    topic: 'Deep Learning & Computer Vision',
    chapter: 'Neural Network Architectures',
    difficulty: 'Hard',
    marks: 4,
    type: 'Multiple Correct',
    source: 'AI Generator',
    status: 'Active',
    version: 'v2.0',
    lastUpdated: '2026-08-03',
    bloomsTaxonomy: 'Apply',
    tags: ['deep-learning', 'cnn', 'computer-vision'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    versionHistory: [
      { version: 'v1.0', date: '2026-08-02', author: 'Gemini AI Assistant', comment: 'AI generated from Deep Learning syllabus' },
      { version: 'v2.0', date: '2026-08-03', author: 'Dr. Sarah Jenkins', comment: 'Reviewed and verified multi-select keys' }
    ]
  },
  {
    id: 'Q-2026-0103',
    title: 'Calculus: Definite Integral Evaluation',
    prompt: 'Evaluate the definite integral ∫ from 0 to 2 of (3x² + 2x - 1) dx.',
    options: [],
    correctAnswerText: '10',
    explanation: 'Antiderivative F(x) = x³ + x² - x. F(2) = (8 + 4 - 2) = 10. F(0) = 0. Therefore, ∫ = 10 - 0 = 10.',
    subject: 'Mathematics',
    topic: 'Integral Calculus',
    chapter: 'Definite Integrals',
    difficulty: 'Easy',
    marks: 3,
    type: 'Numerical',
    source: 'Bulk Import',
    status: 'Active',
    version: 'v1.0',
    lastUpdated: '2026-08-02',
    bloomsTaxonomy: 'Apply',
    tags: ['calculus', 'integration', 'math'],
    imageUrl: null,
    versionHistory: [
      { version: 'v1.0', date: '2026-08-02', author: 'Bulk Ingestion Wizard', comment: 'Imported from Math_Bank_Q3.xlsx' }
    ]
  },
  {
    id: 'Q-2026-0104',
    title: 'Architectural Analysis: REST vs GraphQL APIs',
    prompt: 'Compare RESTful Web APIs and GraphQL. Discuss over-fetching, schema definition, and caching strategies with practical examples.',
    options: [],
    correctAnswerText: 'Descriptive Essay Rubric: 1. Explanation of over-fetching/under-fetching (3 pts), 2. Strongly typed schema comparison (3 pts), 3. HTTP-level caching mechanisms vs field-level resolvers (4 pts).',
    explanation: 'GraphQL allows client-specified field selection eliminating over-fetching, but relies on a single endpoint (/graphql) making traditional HTTP URL caching more complex compared to REST resource endpoints.',
    subject: 'Computer Science',
    topic: 'Web Systems Architecture',
    chapter: 'API Design & Integration',
    difficulty: 'Expert',
    marks: 10,
    type: 'Descriptive',
    source: 'Manual',
    status: 'Active',
    version: 'v1.1',
    lastUpdated: '2026-08-04',
    bloomsTaxonomy: 'Evaluate',
    tags: ['rest', 'graphql', 'architecture', 'web-services'],
    imageUrl: null,
    versionHistory: [
      { version: 'v1.0', date: '2026-07-28', author: 'Admin Proctor', comment: 'Added to final exam pool' }
    ]
  },
  {
    id: 'Q-2026-0105',
    title: 'Quantum Mechanics: Heisenberg Uncertainty Principle',
    prompt: 'According to Heisenberg’s Uncertainty Principle, what happens to the uncertainty in momentum (Δp) as the position of a particle (Δx) is measured with increasing precision (Δx → 0)?',
    options: [
      { id: 'opt-a', text: 'Δp approaches zero', isCorrect: false },
      { id: 'opt-b', text: 'Δp remains constant', isCorrect: false },
      { id: 'opt-c', text: 'Δp approaches infinity (Δp → ∞)', isCorrect: true },
      { id: 'opt-d', text: 'Δp becomes negative', isCorrect: false }
    ],
    correctAnswerText: 'Δp approaches infinity (Δp → ∞)',
    explanation: 'The uncertainty relation is Δx · Δp ≥ ℏ/2. If Δx becomes arbitrarily small, Δp must approach infinity to satisfy the inequality.',
    subject: 'Physics',
    topic: 'Quantum Physics',
    chapter: 'Wave-Particle Duality',
    difficulty: 'Medium',
    marks: 2,
    type: 'Multiple Choice',
    source: 'Manual',
    status: 'Draft',
    version: 'v0.9',
    lastUpdated: '2026-08-05',
    bloomsTaxonomy: 'Understand',
    tags: ['physics', 'quantum', 'heisenberg'],
    imageUrl: null,
    versionHistory: [
      { version: 'v0.9', date: '2026-08-05', author: 'Marcus Vance', comment: 'Draft item awaiting senior faculty review' }
    ]
  },
  {
    id: 'Q-2026-0106',
    title: 'Relational Database: Normal Form Definitions',
    prompt: 'Which normal form requires that a relation is in 2NF and has no transitive dependencies of non-prime attributes on superkeys?',
    options: [
      { id: 'opt-a', text: 'First Normal Form (1NF)', isCorrect: false },
      { id: 'opt-b', text: 'Second Normal Form (2NF)', isCorrect: false },
      { id: 'opt-c', text: 'Third Normal Form (3NF)', isCorrect: true },
      { id: 'opt-d', text: 'Boyce-Codd Normal Form (BCNF)', isCorrect: false }
    ],
    correctAnswerText: 'Third Normal Form (3NF)',
    explanation: '3NF strictly eliminates transitive functional dependencies where a non-key attribute depends on another non-key attribute.',
    subject: 'Computer Science',
    topic: 'Database Management Systems',
    chapter: 'Relational Normalization',
    difficulty: 'Easy',
    marks: 2,
    type: 'Multiple Choice',
    source: 'AI Generator',
    status: 'Active',
    version: 'v1.0',
    lastUpdated: '2026-08-04',
    bloomsTaxonomy: 'Remember',
    tags: ['database', 'sql', 'normalization'],
    imageUrl: null,
    versionHistory: []
  }
];

export const MOCK_SUBJECTS = [
  'Computer Science',
  'Artificial Intelligence',
  'Mathematics',
  'Physics',
  'Electrical Engineering'
];

export const MOCK_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];
export const MOCK_QUESTION_TYPES = ['Multiple Choice', 'Multiple Correct', 'Numerical', 'Descriptive'];
export const MOCK_SOURCES = ['Manual', 'AI Generator', 'Bulk Import'];
export const MOCK_BLOOMS_TAXONOMY = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate'];
