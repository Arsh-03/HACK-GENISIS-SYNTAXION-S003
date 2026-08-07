// Mock Question Bank Service for NEET UG CBT Platform

export const INITIAL_QUESTIONS = [
  {
    id: 'Q-2026-NEET-01',
    title: 'Mechanism of DNA Replication',
    prompt: 'During DNA replication, which enzyme is responsible for catalyzed polymerization of deoxynucleotides in the 5\' to 3\' direction?',
    options: [
      { id: 'opt-a', text: 'DNA Ligase', isCorrect: false },
      { id: 'opt-b', text: 'DNA Polymerase III', isCorrect: true },
      { id: 'opt-c', text: 'Helicase', isCorrect: false },
      { id: 'opt-d', text: 'Primase', isCorrect: false }
    ],
    correctAnswerText: 'DNA Polymerase III',
    explanation: 'DNA Polymerase III synthesizes the leading strand by adding nucleotides in the 5\' to 3\' direction. DNA Ligase seals Okazaki fragments, Helicase unwinds the double helix, and Primase synthesizes RNA primers.',
    subject: 'Botany',
    topic: 'Molecular Basis of Inheritance',
    chapter: 'Genetics and Evolution',
    difficulty: 'Medium',
    marks: 4,
    type: 'Multiple Choice',
    source: 'Syllabus Core',
    status: 'Active',
    version: 'v1.0',
    lastUpdated: '2026-08-01',
    bloomsTaxonomy: 'Remember',
    tags: ['dna', 'replication', 'genetics'],
    imageUrl: null
  },
  {
    id: 'Q-2026-NEET-02',
    title: 'Photoelectric Effect Einstein\'s Equation',
    prompt: 'In a photoelectric effect experiment, when light of frequency 2v is incident on a metal with threshold frequency v, the maximum kinetic energy of emitted photoelectrons is K. What will be the max kinetic energy if frequency is doubled?',
    options: [
      { id: 'opt-a', text: '2K', isCorrect: false },
      { id: 'opt-b', text: '3K', isCorrect: true },
      { id: 'opt-c', text: '4K', isCorrect: false },
      { id: 'opt-d', text: 'K/2', isCorrect: false }
    ],
    correctAnswerText: '3K',
    explanation: 'Einstein\'s Photoelectric Equation: K = h(2v - v) = hv. When frequency is doubled to 4v, new Kinetic Energy K\' = h(4v - v) = 3hv = 3K.',
    subject: 'Physics',
    topic: 'Dual Nature of Matter & Radiation',
    chapter: 'Modern Physics',
    difficulty: 'Hard',
    marks: 4,
    type: 'Multiple Choice',
    source: 'NCERT Exemplar',
    status: 'Active',
    version: 'v1.0',
    lastUpdated: '2026-08-03',
    bloomsTaxonomy: 'Apply',
    tags: ['photoelectric', 'quantum', 'photoelectron'],
    imageUrl: null
  },
  {
    id: 'Q-2026-NEET-03',
    title: 'Hybridization of Xenon Tetrafluoride',
    prompt: 'What is the hybridization and geometry of Xenon Tetrafluoride (XeF4)?',
    options: [
      { id: 'opt-a', text: 'sp3d, Trigonal Bipyramidal', isCorrect: false },
      { id: 'opt-b', text: 'sp3d2, Square Planar', isCorrect: true },
      { id: 'opt-c', text: 'sp3d2, Octahedral', isCorrect: false },
      { id: 'opt-d', text: 'sp3, Tetrahedral', isCorrect: false }
    ],
    correctAnswerText: 'sp3d2, Square Planar',
    explanation: 'Xenon has 8 valence electrons. Four form single bonds with fluorine, leaving 2 lone pairs. Total steric number is 6, resulting in sp3d2 hybridization and square planar molecular geometry.',
    subject: 'Chemistry',
    topic: 'Chemical Bonding & Molecular Structure',
    chapter: 'Inorganic Chemistry',
    difficulty: 'Medium',
    marks: 4,
    type: 'Multiple Choice',
    source: 'Previous Year Paper',
    status: 'Active',
    version: 'v1.1',
    lastUpdated: '2026-08-04',
    bloomsTaxonomy: 'Understand',
    tags: ['bonding', 'hybridization', 'geometry'],
    imageUrl: null
  },
  {
    id: 'Q-2026-NEET-04',
    title: 'Human Heart Cardiac Cycle',
    prompt: 'Which of the following events occurs during joint diastole of the cardiac cycle?',
    options: [
      { id: 'opt-a', text: 'All four chambers are in a relaxed state', isCorrect: true },
      { id: 'opt-b', text: 'Atria contract while ventricles relax', isCorrect: false },
      { id: 'opt-c', text: 'Tricuspid and bicuspid valves are closed', isCorrect: false },
      { id: 'opt-d', text: 'Semilunar valves are wide open', isCorrect: false }
    ],
    correctAnswerText: 'All four chambers are in a relaxed state',
    explanation: 'During joint diastole, all four chambers of the heart are in a relaxed state. Tricuspid and bicuspid valves are open to allow blood flow into ventricles, while semilunar valves are closed.',
    subject: 'Zoology',
    topic: 'Body Fluids & Circulation',
    chapter: 'Human Physiology',
    difficulty: 'Easy',
    marks: 4,
    type: 'Multiple Choice',
    source: 'Manual',
    status: 'Active',
    version: 'v1.0',
    lastUpdated: '2026-08-05',
    bloomsTaxonomy: 'Remember',
    tags: ['heart', 'cardiac-cycle', 'circulation'],
    imageUrl: null
  }
];

export const MOCK_SUBJECTS = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
export const MOCK_CHAPTERS = ['Genetics and Evolution', 'Modern Physics', 'Inorganic Chemistry', 'Human Physiology'];
export const MOCK_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const MOCK_QUESTION_TYPES = ['Multiple Choice', 'Single Choice', 'Assertion-Reason', 'Integer Value'];
export const MOCK_BLOOMS_TAXONOMY = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
export const MOCK_SOURCES = ['Manual', 'AI Generated', 'Imported', 'NCERT Exemplar', 'Previous Year Paper'];
