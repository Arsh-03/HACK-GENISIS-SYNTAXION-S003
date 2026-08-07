// Mock Exam Creation & Blueprint Service for Nexis CBT Platform

export const INITIAL_EXAMS = [
  {
    code: 'EXM-2026-CS101',
    name: 'Computer Science Comprehensive Midterm',
    category: 'Midterm',
    description: 'Comprehensive mid-semester assessment covering Data Structures, Binary Trees, and Algorithm Complexity Analysis.',
    subjects: ['Computer Science', 'Artificial Intelligence'],
    totalQuestions: 50,
    totalMarks: 100,
    durationMinutes: 180,
    status: 'Published',
    createdBy: 'Dr. Sarah Jenkins',
    lastUpdated: '2026-08-01',
    blueprint: {
      subjectWeightage: [
        { subject: 'Computer Science', weightage: 60, questions: 30 },
        { subject: 'Artificial Intelligence', weightage: 40, questions: 20 }
      ],
      difficultyRatio: { easy: 40, medium: 40, hard: 20 },
      topicDistribution: ['Data Structures', 'Algorithms', 'Neural Networks', 'Tree Traversals']
    },
    rules: {
      calculatorAllowed: false,
      negativeMarking: true,
      negativeMarkPenalty: '0.25 pts per wrong answer',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 2,
      cameraRequired: true,
      fullscreenRequired: true
    }
  },
  {
    code: 'EXM-2026-ENG204',
    name: 'Electrical Engineering Systems Final',
    category: 'Final',
    description: 'End-of-term evaluation for Electrical Circuits, Signal Processing, and Control Systems Theory.',
    subjects: ['Electrical Engineering', 'Mathematics'],
    totalQuestions: 40,
    totalMarks: 120,
    durationMinutes: 180,
    status: 'Published',
    createdBy: 'Marcus Vance',
    lastUpdated: '2026-08-03',
    blueprint: {
      subjectWeightage: [
        { subject: 'Electrical Engineering', weightage: 75, questions: 30 },
        { subject: 'Mathematics', weightage: 25, questions: 10 }
      ],
      difficultyRatio: { easy: 30, medium: 50, hard: 20 },
      topicDistribution: ['Circuit Analysis', 'Calculus', 'Signal Processing']
    },
    rules: {
      calculatorAllowed: true,
      negativeMarking: false,
      negativeMarkPenalty: 'None',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 1,
      cameraRequired: true,
      fullscreenRequired: true
    }
  },
  {
    code: 'EXM-2026-AI301',
    name: 'Artificial Intelligence & Neural Net Assessment',
    category: 'Certification',
    description: 'Advanced certification exam for Deep Learning, Computer Vision, and Transformer Model Architectures.',
    subjects: ['Artificial Intelligence'],
    totalQuestions: 30,
    totalMarks: 90,
    durationMinutes: 120,
    status: 'Published',
    createdBy: 'Dr. Sarah Jenkins',
    lastUpdated: '2026-08-04',
    blueprint: {
      subjectWeightage: [
        { subject: 'Artificial Intelligence', weightage: 100, questions: 30 }
      ],
      difficultyRatio: { easy: 20, medium: 50, hard: 30 },
      topicDistribution: ['Deep Learning', 'Computer Vision', 'Transformers']
    },
    rules: {
      calculatorAllowed: false,
      negativeMarking: true,
      negativeMarkPenalty: '0.33 pts per wrong answer',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 1,
      cameraRequired: true,
      fullscreenRequired: true
    }
  },
  {
    code: 'EXM-2026-MATH201',
    name: 'Multivariable Calculus & Integral Equations',
    category: 'Practice',
    description: 'Formative practice paper for derivative applications, line integrals, and vector fields.',
    subjects: ['Mathematics'],
    totalQuestions: 25,
    totalMarks: 50,
    durationMinutes: 90,
    status: 'Draft',
    createdBy: 'Admin Proctor',
    lastUpdated: '2026-08-05',
    blueprint: {
      subjectWeightage: [
        { subject: 'Mathematics', weightage: 100, questions: 25 }
      ],
      difficultyRatio: { easy: 50, medium: 40, hard: 10 },
      topicDistribution: ['Definite Integrals', 'Vector Calculus']
    },
    rules: {
      calculatorAllowed: true,
      negativeMarking: false,
      negativeMarkPenalty: 'None',
      randomizeQuestions: false,
      shuffleOptions: false,
      tabSwitchingLimit: 3,
      cameraRequired: false,
      fullscreenRequired: false
    }
  }
];

export const MOCK_CATEGORIES = ['Midterm', 'Final', 'Certification', 'Practice'];
export const MOCK_AVAILABLE_SUBJECTS = [
  'Computer Science',
  'Artificial Intelligence',
  'Mathematics',
  'Physics',
  'Electrical Engineering'
];
