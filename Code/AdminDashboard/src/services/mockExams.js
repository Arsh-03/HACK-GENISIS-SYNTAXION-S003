// Mock Exam Creation & Blueprint Service for NEET UG CBT Platform

export const INITIAL_EXAMS = [
  {
    code: 'EXM-2026-NEET-PHY',
    name: 'NEET UG Physics Diagnostic Mock',
    category: 'Mock',
    description: 'Special session covering Kinematics, Modern Physics, and Electromagnetism with full negative marking.',
    subjects: ['Physics'],
    totalQuestions: 45,
    totalMarks: 180,
    durationMinutes: 180,
    status: 'Published',
    createdBy: 'Dr. Ramesh Prasad',
    lastUpdated: '2026-08-01',
    blueprint: {
      subjectWeightage: [
        { subject: 'Physics', weightage: 100, questions: 45 }
      ],
      difficultyRatio: { easy: 30, medium: 50, hard: 20 },
      topicDistribution: ['Kinematics', 'Optics', 'Thermodynamics', 'Modern Physics']
    },
    rules: {
      calculatorAllowed: false,
      negativeMarking: true,
      negativeMarkPenalty: '1 pt per wrong answer',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 2,
      cameraRequired: true,
      fullscreenRequired: true
    }
  },
  {
    code: 'EXM-2026-NEET-CHE',
    name: 'NEET UG Chemistry Sectional Mock',
    category: 'Mock',
    description: 'Evaluation of Organic Synthesis pathways, Chemical Bonding, and Equilibrium constants.',
    subjects: ['Chemistry'],
    totalQuestions: 45,
    totalMarks: 180,
    durationMinutes: 180,
    status: 'Published',
    createdBy: 'Prof. Ananya Sen',
    lastUpdated: '2026-08-03',
    blueprint: {
      subjectWeightage: [
        { subject: 'Chemistry', weightage: 100, questions: 45 }
      ],
      difficultyRatio: { easy: 40, medium: 40, hard: 20 },
      topicDistribution: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry']
    },
    rules: {
      calculatorAllowed: false,
      negativeMarking: true,
      negativeMarkPenalty: '1 pt per wrong answer',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 2,
      cameraRequired: true,
      fullscreenRequired: true
    }
  },
  {
    code: 'EXM-2026-NEET-BIO',
    name: 'NEET UG Biology Comprehensive Finals',
    category: 'Final',
    description: 'Complete syllabus review covering Botany (Genetics, Photosynthesis) and Zoology (Human Physiology, Circulation).',
    subjects: ['Botany', 'Zoology'],
    totalQuestions: 90,
    totalMarks: 360,
    durationMinutes: 180,
    status: 'Published',
    createdBy: 'Dr. Sarah Jenkins',
    lastUpdated: '2026-08-05',
    blueprint: {
      subjectWeightage: [
        { subject: 'Botany', weightage: 50, questions: 45 },
        { subject: 'Zoology', weightage: 50, questions: 45 }
      ],
      difficultyRatio: { easy: 30, medium: 50, hard: 20 },
      topicDistribution: ['Genetics', 'Plant Physiology', 'Human Physiology', 'Circulation']
    },
    rules: {
      calculatorAllowed: false,
      negativeMarking: true,
      negativeMarkPenalty: '1 pt per wrong answer',
      randomizeQuestions: true,
      shuffleOptions: true,
      tabSwitchingLimit: 3,
      cameraRequired: true,
      fullscreenRequired: true
    }
  }
];

export const MOCK_EXAM_CATEGORIES = ['Mock', 'Sectional', 'Final', 'Diagnostic'];
export const MOCK_EXAM_SUBJECTS = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

export const MOCK_CATEGORIES = MOCK_EXAM_CATEGORIES;
export const MOCK_AVAILABLE_SUBJECTS = MOCK_EXAM_SUBJECTS;

