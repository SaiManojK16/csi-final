// Mock data for problems and quizzes
// This will be replaced with actual API calls later

export const faProblems = [
  {
    id: 'fa-001',
    title: 'Only 0s Language',
    description: 'Design a Finite Automaton (FA) that accepts strings over the alphabet {0, 1} that contain only 0\'s (no 1\'s allowed).',
    type: 'DFA',
    difficulty: 'Easy',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '000', expected: true, output: 'Accept' },
      { input: '0101', expected: false, output: 'Reject' },
      { input: '0', expected: true, output: 'Accept' }
    ],
    testCases: [
      { input: '', expected: true, description: 'Empty string ε' },
      { input: '0', expected: true, description: 'Single 0' },
      { input: '00', expected: true, description: 'Two 0s' },
      { input: '000', expected: true, description: 'Three 0s' },
      { input: '1', expected: false, description: 'Single 1' },
      { input: '01', expected: false, description: '0 then 1' },
      { input: '10', expected: false, description: '1 then 0' },
      { input: '101', expected: false, description: '1-0-1' },
      { input: '0000', expected: true, description: 'Four 0s' },
      { input: '1111', expected: false, description: 'Only 1s' }
    ]
  },
  {
    id: 'fa-002',
    title: 'Strings Ending with 01',
    description: 'Design a DFA that accepts all strings over {0, 1} that end with "01".',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '01', expected: true, output: 'Accept' },
      { input: '1001', expected: true, output: 'Accept' },
      { input: '10', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '01', expected: true },
      { input: '001', expected: true },
      { input: '1001', expected: true },
      { input: '10', expected: false },
      { input: '00', expected: false },
      { input: '11', expected: false },
      { input: '0101', expected: true },
      { input: '10101', expected: true },
      { input: '0', expected: false }
    ]
  },
  {
    id: 'fa-003',
    title: 'Even Number of 1s',
    description: 'Design a DFA that accepts strings with an even number of 1s (including zero).',
    type: 'DFA',
    difficulty: 'Easy',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '', expected: true, output: 'Accept' },
      { input: '11', expected: true, output: 'Accept' },
      { input: '1', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: true },
      { input: '0', expected: true },
      { input: '1', expected: false },
      { input: '11', expected: true },
      { input: '111', expected: false },
      { input: '1111', expected: true },
      { input: '0011', expected: true },
      { input: '01010', expected: true },
      { input: '10101', expected: false },
      { input: '00000', expected: true }
    ]
  },
  {
    id: 'fa-004',
    title: 'Strings Starting with 01',
    description: 'Design a DFA that accepts all strings over {0, 1} that start with "01".',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '01', expected: true, output: 'Accept' },
      { input: '0101', expected: true, output: 'Accept' },
      { input: '10', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '01', expected: true },
      { input: '010', expected: true },
      { input: '011', expected: true },
      { input: '0101', expected: true },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '10', expected: false },
      { input: '00', expected: false },
      { input: '11', expected: false }
    ]
  },
  {
    id: 'fa-005',
    title: 'Strings Containing Substring 101',
    description: 'Design a DFA that accepts all strings over {0, 1} that contain "101" as a substring.',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '101', expected: true, output: 'Accept' },
      { input: '0101', expected: true, output: 'Accept' },
      { input: '100', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '101', expected: true },
      { input: '0101', expected: true },
      { input: '1010', expected: true },
      { input: '1101', expected: true },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '10', expected: false },
      { input: '100', expected: false },
      { input: '111', expected: false }
    ]
  },
  {
    id: 'fa-006',
    title: 'Binary Numbers Divisible by 3',
    description: 'Design a DFA that accepts binary numbers (interpreted as decimal) that are divisible by 3.',
    type: 'DFA',
    difficulty: 'Hard',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '11', expected: true, output: 'Accept' }, // 3 in binary
      { input: '110', expected: true, output: 'Accept' }, // 6 in binary
      { input: '10', expected: false, output: 'Reject' } // 2 in binary
    ],
    testCases: [
      { input: '', expected: true }, // 0 is divisible by 3
      { input: '0', expected: true }, // 0
      { input: '11', expected: true }, // 3
      { input: '110', expected: true }, // 6
      { input: '1001', expected: true }, // 9
      { input: '1', expected: false }, // 1
      { input: '10', expected: false }, // 2
      { input: '100', expected: false }, // 4
      { input: '101', expected: false }, // 5
      { input: '111', expected: false } // 7
    ]
  },
  {
    id: 'fa-007',
    title: 'Exactly Two 1s',
    description: 'Design a DFA that accepts strings over {0, 1} that contain exactly two 1s.',
    type: 'DFA',
    difficulty: 'Easy',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '11', expected: true, output: 'Accept' },
      { input: '101', expected: true, output: 'Accept' },
      { input: '111', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '11', expected: true },
      { input: '101', expected: true },
      { input: '110', expected: true },
      { input: '011', expected: true },
      { input: '111', expected: false },
      { input: '1011', expected: false },
      { input: '00100', expected: true }
    ]
  },
  {
    id: 'fa-008',
    title: 'Strings Not Containing 00',
    description: 'Design a DFA that accepts strings over {0, 1} that do not contain "00" as a substring.',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '0101', expected: true, output: 'Accept' },
      { input: '101', expected: true, output: 'Accept' },
      { input: '100', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: true },
      { input: '0', expected: true },
      { input: '1', expected: true },
      { input: '01', expected: true },
      { input: '10', expected: true },
      { input: '00', expected: false },
      { input: '100', expected: false },
      { input: '001', expected: false },
      { input: '0101', expected: true },
      { input: '10101', expected: true }
    ]
  },
  {
    id: 'fa-009',
    title: 'Strings Ending with 00 or 11',
    description: 'Design a DFA that accepts strings over {0, 1} that end with either "00" or "11".',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '00', expected: true, output: 'Accept' },
      { input: '11', expected: true, output: 'Accept' },
      { input: '01', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '00', expected: true },
      { input: '11', expected: true },
      { input: '100', expected: true },
      { input: '011', expected: true },
      { input: '01', expected: false },
      { input: '10', expected: false },
      { input: '10100', expected: true }
    ]
  },
  {
    id: 'fa-010',
    title: 'Strings with Odd Length',
    description: 'Design a DFA that accepts strings over {0, 1} that have an odd length.',
    type: 'DFA',
    difficulty: 'Easy',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '0', expected: true, output: 'Accept' },
      { input: '101', expected: true, output: 'Accept' },
      { input: '00', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '0', expected: true },
      { input: '1', expected: true },
      { input: '00', expected: false },
      { input: '11', expected: false },
      { input: '101', expected: true },
      { input: '000', expected: true },
      { input: '1111', expected: false },
      { input: '01010', expected: true },
      { input: '101010', expected: false }
    ]
  },
  {
    id: 'fa-011',
    title: 'At Least Two 0s',
    description: 'Design a DFA that accepts strings over {0, 1} that contain at least two 0s.',
    type: 'DFA',
    difficulty: 'Easy',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '00', expected: true, output: 'Accept' },
      { input: '010', expected: true, output: 'Accept' },
      { input: '1', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '00', expected: true },
      { input: '010', expected: true },
      { input: '100', expected: true },
      { input: '000', expected: true },
      { input: '1010', expected: true },
      { input: '11', expected: false },
      { input: '101', expected: false }
    ]
  },
  {
    id: 'fa-012',
    title: 'Starting and Ending with Same Symbol',
    description: 'Design a DFA that accepts strings over {0, 1} that start and end with the same symbol.',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '0', expected: true, output: 'Accept' },
      { input: '101', expected: true, output: 'Accept' },
      { input: '01', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '0', expected: true },
      { input: '1', expected: true },
      { input: '00', expected: true },
      { input: '11', expected: true },
      { input: '01', expected: false },
      { input: '10', expected: false },
      { input: '010', expected: true },
      { input: '101', expected: true },
      { input: '0101', expected: false }
    ]
  },
  {
    id: 'fa-013',
    title: 'Equal Number of 0s and 1s',
    description: 'Design a DFA that accepts strings over {0, 1} that have an equal number of 0s and 1s.',
    type: 'DFA',
    difficulty: 'Hard',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '', expected: true, output: 'Accept' },
      { input: '01', expected: true, output: 'Accept' },
      { input: '001', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: true },
      { input: '01', expected: true },
      { input: '10', expected: true },
      { input: '0011', expected: true },
      { input: '0101', expected: true },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '00', expected: false },
      { input: '001', expected: false },
      { input: '000111', expected: true }
    ]
  },
  {
    id: 'fa-014',
    title: 'Binary Divisible by 4',
    description: 'Design a DFA that accepts binary numbers (as strings) that are divisible by 4.',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '100', expected: true, output: 'Accept' }, // 4 in binary
      { input: '1000', expected: true, output: 'Accept' }, // 8 in binary
      { input: '10', expected: false, output: 'Reject' } // 2 in binary
    ],
    testCases: [
      { input: '', expected: true }, // 0
      { input: '0', expected: true }, // 0
      { input: '100', expected: true }, // 4
      { input: '1000', expected: true }, // 8
      { input: '1100', expected: true }, // 12
      { input: '1', expected: false }, // 1
      { input: '10', expected: false }, // 2
      { input: '11', expected: false }, // 3
      { input: '101', expected: false }, // 5
      { input: '111', expected: false } // 7
    ]
  },
  {
    id: 'fa-015',
    title: 'Strings Not Ending with 11',
    description: 'Design a DFA that accepts strings over {0, 1} that do not end with "11".',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '', expected: true, output: 'Accept' },
      { input: '01', expected: true, output: 'Accept' },
      { input: '11', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: true },
      { input: '0', expected: true },
      { input: '1', expected: true },
      { input: '00', expected: true },
      { input: '01', expected: true },
      { input: '10', expected: true },
      { input: '11', expected: false },
      { input: '011', expected: false },
      { input: '1011', expected: false },
      { input: '0101', expected: true }
    ]
  },
  {
    id: 'fa-016',
    title: 'Pattern 0*1*',
    description: 'Design a DFA that accepts strings over {0, 1} matching the pattern 0*1* (any number of 0s followed by any number of 1s).',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '', expected: true, output: 'Accept' },
      { input: '0011', expected: true, output: 'Accept' },
      { input: '101', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: true },
      { input: '0', expected: true },
      { input: '1', expected: true },
      { input: '00', expected: true },
      { input: '11', expected: true },
      { input: '0011', expected: true },
      { input: '01', expected: true },
      { input: '10', expected: false },
      { input: '101', expected: false },
      { input: '0101', expected: false }
    ]
  },
  {
    id: 'fa-017',
    title: 'At Most One 0',
    description: 'Design a DFA that accepts strings over {0, 1} that contain at most one 0.',
    type: 'DFA',
    difficulty: 'Easy',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '', expected: true, output: 'Accept' },
      { input: '1', expected: true, output: 'Accept' },
      { input: '00', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: true },
      { input: '0', expected: true },
      { input: '1', expected: true },
      { input: '01', expected: true },
      { input: '10', expected: true },
      { input: '11', expected: true },
      { input: '101', expected: true },
      { input: '00', expected: false },
      { input: '010', expected: false },
      { input: '1001', expected: false }
    ]
  },
  {
    id: 'fa-018',
    title: 'Strings with Three Consecutive 1s',
    description: 'Design a DFA that accepts strings over {0, 1} that contain three consecutive 1s.',
    type: 'DFA',
    difficulty: 'Medium',
    status: 'unsolved',
    alphabet: ['0', '1'],
    examples: [
      { input: '111', expected: true, output: 'Accept' },
      { input: '0111', expected: true, output: 'Accept' },
      { input: '11', expected: false, output: 'Reject' }
    ],
    testCases: [
      { input: '', expected: false },
      { input: '0', expected: false },
      { input: '1', expected: false },
      { input: '11', expected: false },
      { input: '111', expected: true },
      { input: '0111', expected: true },
      { input: '1110', expected: true },
      { input: '10111', expected: true },
      { input: '101', expected: false },
      { input: '1101', expected: false }
    ]
  }
];

export const mcqQuizzes = [
  {
    id: 'mcq-001',
    title: 'Finite Automata Basics',
    description: 'Test your understanding of basic FA concepts',
    difficulty: 'Easy',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 10, // minutes
    questions: [
      {
        id: 'q1',
        question: 'What does DFA stand for?',
        options: [
          'Deterministic Finite Automaton',
          'Dynamic Function Analysis',
          'Digital File Accessor',
          'Distributed Finite Array'
        ],
        correctAnswer: 0,
        explanation: 'DFA stands for Deterministic Finite Automaton, a theoretical model of computation with finite states and deterministic transitions.',
        topic: 'DFA Basics',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'In a DFA, how many transitions can a state have for a given input symbol?',
        options: [
          'Zero or more',
          'Exactly one',
          'One or more',
          'At most two'
        ],
        correctAnswer: 1,
        explanation: 'In a DFA, each state must have exactly one transition for each symbol in the alphabet, ensuring deterministic behavior.',
        topic: 'DFA Properties',
        difficulty: 'Easy'
      },
      {
        id: 'q3',
        question: 'What is an accepting state in a finite automaton?',
        options: [
          'The starting state of the automaton',
          'A state where the machine accepts the input string',
          'A state with no outgoing transitions',
          'A state that accepts all symbols'
        ],
        correctAnswer: 1,
        explanation: 'An accepting (or final) state is where the automaton ends up after processing a valid input string, indicating the string is accepted by the language.',
        topic: 'States and Transitions',
        difficulty: 'Easy'
      },
      {
        id: 'q4',
        question: 'What happens when a DFA reaches a state with no defined transition for the current input symbol?',
        options: [
          'It accepts the string',
          'It goes to a dead/trap state and rejects',
          'It restarts from the start state',
          'It randomly chooses a state'
        ],
        correctAnswer: 1,
        explanation: 'When there\'s no defined transition, the DFA implicitly moves to a dead state (trap state) from which it cannot reach an accepting state, resulting in rejection.',
        topic: 'DFA Behavior',
        difficulty: 'Medium',
        isTrick: true
      },
      {
        id: 'q5',
        question: 'Which of the following is true about the empty string (ε)?',
        options: [
          'It is never accepted by any automaton',
          'It is accepted if the start state is an accepting state',
          'It always requires a special transition',
          'It must be explicitly defined in the alphabet'
        ],
        correctAnswer: 1,
        explanation: 'The empty string ε is accepted by an automaton if and only if the start state is also an accepting state, since no transitions are taken.',
        topic: 'Special Cases',
        difficulty: 'Medium',
        isTrick: true
      }
    ]
  },
  {
    id: 'mcq-002',
    title: 'NFA vs DFA',
    description: 'Compare and contrast NFAs and DFAs',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is the main difference between NFA and DFA?',
        options: [
          'NFA can have multiple states',
          'NFA allows multiple transitions for same input symbol',
          'DFA cannot accept any language',
          'NFA is more powerful than DFA'
        ],
        correctAnswer: 1,
        explanation: 'The main difference is that NFAs allow non-determinism: a state can have zero, one, or multiple transitions for the same input symbol.',
        topic: 'NFA vs DFA',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'Can every NFA be converted to an equivalent DFA?',
        options: [
          'No, some languages only NFAs can recognize',
          'Yes, using subset construction',
          'Only if the NFA has no ε-transitions',
          'No, DFAs are less powerful'
        ],
        correctAnswer: 1,
        explanation: 'Yes, every NFA can be converted to an equivalent DFA using the subset construction algorithm, proving they recognize the same class of languages (regular languages).',
        topic: 'NFA Conversion',
        difficulty: 'Medium',
        isTrick: true
      },
      {
        id: 'q3',
        question: 'What are ε-transitions in NFAs?',
        options: [
          'Transitions that consume no input',
          'Transitions that reject the input',
          'Transitions between accepting states only',
          'Invalid transitions'
        ],
        correctAnswer: 0,
        explanation: 'ε-transitions (epsilon transitions) allow state changes without consuming any input symbol, adding another layer of non-determinism to NFAs.',
        topic: 'NFA Properties',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'Which is generally easier to design?',
        options: [
          'DFA, because it\'s deterministic',
          'NFA, because it allows more flexibility',
          'Both are equally easy',
          'Neither, they\'re both impossible'
        ],
        correctAnswer: 1,
        explanation: 'NFAs are often easier to design because non-determinism allows more flexibility and often results in fewer states for the same language.',
        topic: 'Design Complexity',
        difficulty: 'Easy'
      },
      {
        id: 'q5',
        question: 'In terms of computational power, how do NFAs and DFAs compare?',
        options: [
          'NFAs are more powerful',
          'DFAs are more powerful',
          'They are equivalent in power',
          'It depends on the language'
        ],
        correctAnswer: 2,
        explanation: 'NFAs and DFAs are equivalent in computational power - they both recognize exactly the regular languages. Any language accepted by one can be accepted by the other.',
        topic: 'Computational Power',
        difficulty: 'Medium',
        isTrick: true
      }
    ]
  },
  {
    id: 'mcq-003',
    title: 'Regular Languages',
    description: 'Test your knowledge of regular languages and their properties',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'What is a regular language?',
        options: [
          'A language that can be recognized by a finite automaton',
          'A language that contains only regular expressions',
          'A language with a finite number of words',
          'A language that can be parsed by a regular grammar only'
        ],
        correctAnswer: 0,
        explanation: 'A regular language is one that can be recognized by a finite automaton (DFA, NFA, or ε-NFA).',
        topic: 'Regular Languages',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'Which of the following is NOT a regular language?',
        options: [
          '{0^n 1^n | n ≥ 0}',
          '{0*1*}',
          '{0^n | n ≥ 0}',
          '{strings with even number of 0s}'
        ],
        correctAnswer: 0,
        explanation: '{0^n 1^n | n ≥ 0} is a context-free language but not regular, as it requires counting and matching.',
        topic: 'Language Classification',
        difficulty: 'Hard',
        isTrick: true
      },
      {
        id: 'q3',
        question: 'Are regular languages closed under union?',
        options: [
          'Yes, always',
          'No, never',
          'Only for finite languages',
          'Only for infinite languages'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages are closed under union, intersection, complement, concatenation, and Kleene star operations.',
        topic: 'Closure Properties',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'What is the Pumping Lemma used for?',
        options: [
          'To prove a language is regular',
          'To prove a language is NOT regular',
          'To construct a DFA',
          'To minimize a DFA'
        ],
        correctAnswer: 1,
        explanation: 'The Pumping Lemma is primarily used to prove that certain languages are NOT regular by showing they violate the pumping property.',
        topic: 'Pumping Lemma',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        question: 'Can every regular language be expressed by a regular expression?',
        options: [
          'Yes, they are equivalent',
          'No, only some can',
          'Only finite languages',
          'Only infinite languages'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages and regular expressions are equivalent - every regular language can be expressed by a regular expression and vice versa.',
        topic: 'Regular Expressions',
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 'mcq-004',
    title: 'State Minimization',
    description: 'Learn about minimizing DFAs and state reduction',
    difficulty: 'Hard',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is the goal of DFA minimization?',
        options: [
          'To reduce the number of states to the minimum possible',
          'To increase the number of states for clarity',
          'To add more transitions',
          'To make the DFA deterministic'
        ],
        correctAnswer: 0,
        explanation: 'DFA minimization aims to reduce the number of states while maintaining the same language recognition capability.',
        topic: 'Minimization',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'Two states are equivalent if:',
        options: [
          'They have the same transitions',
          'They produce the same output for all input strings',
          'They are both accepting states',
          'They have the same number of outgoing transitions'
        ],
        correctAnswer: 1,
        explanation: 'Two states are equivalent if, starting from either state, the automaton accepts exactly the same set of strings.',
        topic: 'State Equivalence',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'What algorithm is commonly used for DFA minimization?',
        options: [
          'Kleene star algorithm',
          'Table-filling algorithm',
          'Subset construction',
          'BFS algorithm'
        ],
        correctAnswer: 1,
        explanation: 'The table-filling algorithm (also known as the Myhill-Nerode algorithm) is commonly used to find equivalent states and minimize DFAs.',
        topic: 'Minimization Algorithm',
        difficulty: 'Hard'
      },
      {
        id: 'q4',
        question: 'Can a minimal DFA have unreachable states?',
        options: [
          'Yes, but they should be removed',
          'No, by definition it cannot',
          'Only if they are accepting',
          'Only if they are starting states'
        ],
        correctAnswer: 1,
        explanation: 'A minimal DFA cannot have unreachable states, as they would be redundant and could be removed without affecting the language.',
        topic: 'Minimal DFA Properties',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        question: 'What is the time complexity of the table-filling minimization algorithm?',
        options: [
          'O(n)',
          'O(n log n)',
          'O(n²)',
          'O(2^n)'
        ],
        correctAnswer: 2,
        explanation: 'The table-filling algorithm has O(n²) time complexity where n is the number of states, as it compares all pairs of states.',
        topic: 'Algorithm Complexity',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'mcq-005',
    title: 'Transition Functions',
    description: 'Master transition functions and state transitions',
    difficulty: 'Easy',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is a transition function?',
        options: [
          'A function that maps states to accepting states',
          'A function that maps (state, symbol) to next state',
          'A function that counts transitions',
          'A function that validates input strings'
        ],
        correctAnswer: 1,
        explanation: 'A transition function δ maps a current state and an input symbol to the next state in the automaton.',
        topic: 'Transition Functions',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'In a DFA, the transition function is:',
        options: [
          'Partial (may be undefined)',
          'Total (defined for all state-symbol pairs)',
          'Random',
          'Optional'
        ],
        correctAnswer: 1,
        explanation: 'In a DFA, the transition function must be total - defined for every state and every symbol in the alphabet.',
        topic: 'DFA Transitions',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'What happens if a transition function is undefined for a state-symbol pair in a DFA?',
        options: [
          'The automaton accepts',
          'The automaton goes to a dead state',
          'The automaton rejects immediately',
          'It is not allowed in a DFA'
        ],
        correctAnswer: 3,
        explanation: 'In a formal DFA, the transition function must be total. If not specified, it implicitly goes to a dead/reject state.',
        topic: 'Dead States',
        difficulty: 'Medium',
        isTrick: true
      },
      {
        id: 'q4',
        question: 'Can a transition function map to multiple states in a DFA?',
        options: [
          'Yes, always',
          'No, only in NFA',
          'Only for accepting states',
          'Only for the start state'
        ],
        correctAnswer: 1,
        explanation: 'In a DFA, each transition must map to exactly one state. Multiple transitions are only allowed in NFAs.',
        topic: 'Determinism',
        difficulty: 'Easy'
      },
      {
        id: 'q5',
        question: 'What is δ(q, a) typically used to denote?',
        options: [
          'The state reached from q on input a',
          'The alphabet symbol a',
          'The accepting state',
          'The start state'
        ],
        correctAnswer: 0,
        explanation: 'δ(q, a) denotes the transition function value - the state reached from state q when reading symbol a.',
        topic: 'Notation',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'mcq-006',
    title: 'Dead States',
    description: 'Understand dead states and trap states in automata',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is a dead state?',
        options: [
          'A state with no incoming transitions',
          'A non-accepting state with no outgoing transitions',
          'An accepting state',
          'The start state'
        ],
        correctAnswer: 1,
        explanation: 'A dead state (or trap state) is a non-accepting state from which no accepting state can be reached.',
        topic: 'Dead States',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'What happens when a DFA enters a dead state?',
        options: [
          'It accepts the string',
          'It will reject regardless of remaining input',
          'It restarts',
          'It becomes non-deterministic'
        ],
        correctAnswer: 1,
        explanation: 'Once a DFA enters a dead state, it will remain there and reject the string regardless of what input follows.',
        topic: 'Dead State Behavior',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'Are dead states necessary in a DFA?',
        options: [
          'Yes, always required',
          'No, they can be omitted if transitions are not total',
          'Only for accepting automata',
          'Only for rejecting automata'
        ],
        correctAnswer: 1,
        explanation: 'Dead states are not strictly necessary if we allow partial transition functions, but they are often used for clarity.',
        topic: 'DFA Design',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'Can a dead state be an accepting state?',
        options: [
          'Yes, always',
          'No, by definition it cannot',
          'Only in NFAs',
          'Only if it has self-loops'
        ],
        correctAnswer: 1,
        explanation: 'By definition, a dead state is a non-accepting state. If it were accepting, it would not be a dead state.',
        topic: 'Dead State Definition',
        difficulty: 'Easy'
      },
      {
        id: 'q5',
        question: 'What is another name for a dead state?',
        options: [
          'Accepting state',
          'Trap state',
          'Start state',
          'Final state'
        ],
        correctAnswer: 1,
        explanation: 'A dead state is also called a trap state, sink state, or reject state.',
        topic: 'Terminology',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'mcq-007',
    title: 'Language Recognition',
    description: 'Test understanding of how automata recognize languages',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'When does a DFA accept a string?',
        options: [
          'When it reaches any state',
          'When it reaches an accepting state after reading all input',
          'When it reads the first symbol',
          'When it has no transitions left'
        ],
        correctAnswer: 1,
        explanation: 'A DFA accepts a string if, after processing all input symbols, it ends in an accepting (final) state.',
        topic: 'Acceptance',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'What is the language recognized by a DFA?',
        options: [
          'The set of all input symbols',
          'The set of all states',
          'The set of all strings accepted by the DFA',
          'The set of all transitions'
        ],
        correctAnswer: 2,
        explanation: 'The language recognized (or accepted) by a DFA is the set of all strings that cause the DFA to end in an accepting state.',
        topic: 'Language Definition',
        difficulty: 'Easy'
      },
      {
        id: 'q3',
        question: 'Can a DFA recognize an infinite language?',
        options: [
          'No, DFAs only recognize finite languages',
          'Yes, if the language is regular',
          'Only if it has infinite states',
          'Only for empty strings'
        ],
        correctAnswer: 1,
        explanation: 'DFAs can recognize infinite regular languages, such as {0^n | n ≥ 0} (all strings of 0s).',
        topic: 'Infinite Languages',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'What does it mean if two DFAs recognize the same language?',
        options: [
          'They must have the same number of states',
          'They are equivalent',
          'They must have the same transitions',
          'They must have the same start state'
        ],
        correctAnswer: 1,
        explanation: 'Two DFAs are equivalent if they recognize the same language, regardless of their structure.',
        topic: 'DFA Equivalence',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        question: 'Can a single DFA recognize multiple languages?',
        options: [
          'Yes, by changing the accepting states',
          'No, each DFA recognizes exactly one language',
          'Only if it has multiple start states',
          'Only in NFAs'
        ],
        correctAnswer: 1,
        explanation: 'A DFA recognizes exactly one language - the set of strings that lead to accepting states. Changing accepting states changes the language.',
        topic: 'Language Uniqueness',
        difficulty: 'Medium',
        isTrick: true
      }
    ]
  },
  {
    id: 'mcq-008',
    title: 'Finite vs Infinite',
    description: 'Distinguish between finite and infinite languages',
    difficulty: 'Easy',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is a finite language?',
        options: [
          'A language with a finite number of states',
          'A language with a finite number of strings',
          'A language with finite alphabet',
          'A language that accepts in finite time'
        ],
        correctAnswer: 1,
        explanation: 'A finite language is one that contains a finite number of strings (words).',
        topic: 'Finite Languages',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'Is every finite language regular?',
        options: [
          'Yes, always',
          'No, never',
          'Only if it has less than 10 strings',
          'Only if it uses binary alphabet'
        ],
        correctAnswer: 0,
        explanation: 'Every finite language is regular - it can be recognized by a DFA that has a unique path for each string.',
        topic: 'Finite and Regular',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'Which is an example of an infinite regular language?',
        options: [
          '{ε, 0, 1}',
          '{0, 1, 00, 11}',
          '{0^n | n ≥ 0}',
          '{} (empty set)'
        ],
        correctAnswer: 2,
        explanation: '{0^n | n ≥ 0} = {ε, 0, 00, 000, ...} is an infinite regular language containing all strings of 0s.',
        topic: 'Infinite Regular',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'Can a DFA with n states recognize a language with more than n strings?',
        options: [
          'No, impossible',
          'Yes, if the language is regular',
          'Only if n = 0',
          'Only for finite languages'
        ],
        correctAnswer: 1,
        explanation: 'Yes, a DFA can recognize an infinite language with only finitely many states, as long as the language is regular.',
        topic: 'State Count',
        difficulty: 'Medium',
        isTrick: true
      },
      {
        id: 'q5',
        question: 'What is the maximum number of strings in a finite language recognized by a DFA with n states?',
        options: [
          'n',
          'n²',
          'Unlimited',
          'Depends on the alphabet size'
        ],
        correctAnswer: 3,
        explanation: 'The maximum depends on the alphabet size. With alphabet size k, theoretically up to k^n strings could be recognized, but practical limits vary.',
        topic: 'Finite Language Limits',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'mcq-009',
    title: 'Pumping Lemma',
    description: 'Master the Pumping Lemma for regular languages',
    difficulty: 'Hard',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is the Pumping Lemma used for?',
        options: [
          'To prove a language is regular',
          'To prove a language is NOT regular',
          'To construct a DFA',
          'To minimize a DFA'
        ],
        correctAnswer: 1,
        explanation: 'The Pumping Lemma is primarily used to prove that certain languages are NOT regular by showing they violate the pumping property.',
        topic: 'Pumping Lemma Purpose',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        question: 'For a regular language L, the Pumping Lemma states that there exists a pumping length p such that:',
        options: [
          'All strings shorter than p are in L',
          'Any string in L of length ≥ p can be pumped',
          'All strings in L must have length p',
          'Only strings of length p are in L'
        ],
        correctAnswer: 1,
        explanation: 'The Pumping Lemma states that for any string w in L with |w| ≥ p, w can be divided into xyz such that xy^iz is in L for all i ≥ 0.',
        topic: 'Pumping Property',
        difficulty: 'Hard'
      },
      {
        id: 'q3',
        question: 'In the Pumping Lemma, what is the constraint on |xy|?',
        options: [
          '|xy| ≥ p',
          '|xy| ≤ p',
          '|xy| = p',
          'No constraint'
        ],
        correctAnswer: 1,
        explanation: 'In the Pumping Lemma, we require |xy| ≤ p, meaning the first two parts together cannot exceed the pumping length.',
        topic: 'Pumping Constraints',
        difficulty: 'Hard'
      },
      {
        id: 'q4',
        question: 'What does it mean if we can pump a string and it violates the language?',
        options: [
          'The language is regular',
          'The language is NOT regular',
          'The pumping length is wrong',
          'The string is invalid'
        ],
        correctAnswer: 1,
        explanation: 'If we can find a string that violates the pumping property (pumping it produces strings not in the language), the language is NOT regular.',
        topic: 'Pumping Proof',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        question: 'Which language can be proven non-regular using the Pumping Lemma?',
        options: [
          '{0*1*}',
          '{0^n 1^n | n ≥ 0}',
          '{strings with even number of 0s}',
          '{0^n | n ≥ 0}'
        ],
        correctAnswer: 1,
        explanation: '{0^n 1^n | n ≥ 0} is not regular and can be proven using the Pumping Lemma by showing that pumping breaks the equal count property.',
        topic: 'Pumping Applications',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'mcq-010',
    title: 'Closure Properties',
    description: 'Test knowledge of closure properties of regular languages',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'Are regular languages closed under union?',
        options: [
          'Yes',
          'No',
          'Only for finite languages',
          'Only sometimes'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages are closed under union - if L1 and L2 are regular, then L1 ∪ L2 is also regular.',
        topic: 'Union Closure',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'Are regular languages closed under intersection?',
        options: [
          'Yes',
          'No',
          'Only for finite languages',
          'Only for infinite languages'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages are closed under intersection, which can be proven using De Morgan\'s law and closure under complement and union.',
        topic: 'Intersection Closure',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'Are regular languages closed under complement?',
        options: [
          'Yes',
          'No',
          'Only for finite languages',
          'Only for infinite languages'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages are closed under complement - swap accepting and non-accepting states in a DFA to get the complement.',
        topic: 'Complement Closure',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'Are regular languages closed under concatenation?',
        options: [
          'Yes',
          'No',
          'Only for finite languages',
          'Only if both languages are finite'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages are closed under concatenation - the concatenation of two regular languages is also regular.',
        topic: 'Concatenation Closure',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        question: 'Are regular languages closed under Kleene star?',
        options: [
          'Yes',
          'No',
          'Only for finite languages',
          'Only for languages with ε'
        ],
        correctAnswer: 0,
        explanation: 'Regular languages are closed under Kleene star - L* (zero or more concatenations of strings from L) is regular if L is regular.',
        topic: 'Kleene Star Closure',
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 'mcq-011',
    title: 'Regex Equivalence',
    description: 'Understand regular expressions and their equivalence to automata',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'What does the regular expression 0* represent?',
        options: [
          'Exactly one 0',
          'Zero or more 0s',
          'One or more 0s',
          'Exactly zero 0s'
        ],
        correctAnswer: 1,
        explanation: 'The Kleene star * means "zero or more", so 0* represents the language {ε, 0, 00, 000, ...}.',
        topic: 'Kleene Star',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'What does the regular expression 0+ represent?',
        options: [
          'Exactly one 0',
          'Zero or more 0s',
          'One or more 0s',
          'Exactly zero 0s'
        ],
        correctAnswer: 2,
        explanation: 'The + operator means "one or more", so 0+ represents the language {0, 00, 000, ...} (excluding ε).',
        topic: 'Plus Operator',
        difficulty: 'Easy'
      },
      {
        id: 'q3',
        question: 'Are regular expressions and finite automata equivalent?',
        options: [
          'Yes, they recognize the same class of languages',
          'No, regular expressions are more powerful',
          'No, finite automata are more powerful',
          'Only for finite languages'
        ],
        correctAnswer: 0,
        explanation: 'Regular expressions and finite automata are equivalent - they both recognize exactly the regular languages.',
        topic: 'Regex-Automata Equivalence',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'What does (0|1)* represent?',
        options: [
          'Either 0 or 1',
          'All strings over {0, 1}',
          'Strings starting with 0 or 1',
          'Strings ending with 0 or 1'
        ],
        correctAnswer: 1,
        explanation: '(0|1) means "0 or 1", and * means "zero or more", so (0|1)* represents all possible strings over the alphabet {0, 1}.',
        topic: 'Complex Regex',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        question: 'What does the regular expression 01?0 represent?',
        options: [
          '010 or 00',
          '010 only',
          '00 or 010',
          '01 followed by any number of 0s'
        ],
        correctAnswer: 0,
        explanation: 'The ? means "zero or one", so 01?0 matches either 010 (with 1) or 00 (without 1).',
        topic: 'Question Mark Operator',
        difficulty: 'Medium',
        isTrick: true
      }
    ]
  },
  {
    id: 'mcq-012',
    title: 'DFA Construction',
    description: 'Test skills in constructing DFAs for given languages',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'How many states are needed for a DFA that accepts strings with exactly n 1s?',
        options: [
          'n states',
          'n+1 states',
          'n+2 states',
          '2^n states'
        ],
        correctAnswer: 1,
        explanation: 'We need n+1 states to count from 0 to n occurrences of 1, with the state representing n being accepting.',
        topic: 'State Counting',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        question: 'What is the minimum number of states needed for a DFA accepting strings ending with "01"?',
        options: [
          '2 states',
          '3 states',
          '4 states',
          '5 states'
        ],
        correctAnswer: 1,
        explanation: 'We need 3 states: one for "not yet seen 0", one for "seen 0 but not yet 01", and one for "seen 01" (accepting).',
        topic: 'Minimum States',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'When constructing a DFA, what should you do first?',
        options: [
          'Add all transitions',
          'Identify the states needed',
          'Set accepting states',
          'Define the alphabet'
        ],
        correctAnswer: 1,
        explanation: 'The typical approach is to first identify what states are needed to track the necessary information, then add transitions.',
        topic: 'Construction Strategy',
        difficulty: 'Easy'
      },
      {
        id: 'q4',
        question: 'What information must a state "remember" in a DFA for strings ending with "01"?',
        options: [
          'The entire string seen so far',
          'The last two symbols seen',
          'The number of 0s and 1s',
          'The length of the string'
        ],
        correctAnswer: 1,
        explanation: 'To detect strings ending with "01", we only need to remember the last two symbols to know if we\'ve seen "01".',
        topic: 'State Information',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        question: 'Can a DFA with 2 states accept all strings over {0, 1}?',
        options: [
          'Yes, always',
          'No, impossible',
          'Only if both states are accepting',
          'Only for finite languages'
        ],
        correctAnswer: 2,
        explanation: 'Yes, if both states are accepting and we have transitions that allow reaching either state from any state, we can accept all strings.',
        topic: 'Universal Language',
        difficulty: 'Hard',
        isTrick: true
      }
    ]
  },
  {
    id: 'mcq-013',
    title: 'Language Operations',
    description: 'Understand operations on languages and their results',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'What is the concatenation of languages L1 = {0} and L2 = {1}?',
        options: [
          '{0, 1}',
          '{01}',
          '{0, 1, 01}',
          '{} (empty set)'
        ],
        correctAnswer: 1,
        explanation: 'Concatenation L1L2 means all strings formed by taking a string from L1 followed by a string from L2, so {0}{1} = {01}.',
        topic: 'Concatenation',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        question: 'What is L* where L = {0, 1}?',
        options: [
          '{0, 1}',
          '{0, 1, 00, 11}',
          'All strings over {0, 1}',
          '{ε, 0, 1}'
        ],
        correctAnswer: 2,
        explanation: 'L* is the Kleene closure, meaning zero or more concatenations of strings from L, so {0, 1}* = all strings over {0, 1}.',
        topic: 'Kleene Star',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'What is the union of {0} and {1}?',
        options: [
          '{01}',
          '{0, 1}',
          '{0, 1, 01}',
          '{} (empty set)'
        ],
        correctAnswer: 1,
        explanation: 'The union of two languages contains all strings that are in either language, so {0} ∪ {1} = {0, 1}.',
        topic: 'Union',
        difficulty: 'Easy'
      },
      {
        id: 'q4',
        question: 'What is the complement of {0}* over alphabet {0, 1}?',
        options: [
          '{1}*',
          'All strings containing at least one 1',
          '{ε}',
          'The empty set'
        ],
        correctAnswer: 1,
        explanation: 'The complement of {0}* (all strings of 0s) over {0, 1} is all strings containing at least one 1.',
        topic: 'Complement',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        question: 'If L is regular, is L² (L concatenated with itself) regular?',
        options: [
          'Yes, always',
          'No, never',
          'Only if L is finite',
          'Only if L contains ε'
        ],
        correctAnswer: 0,
        explanation: 'Yes, since regular languages are closed under concatenation, L² = LL is regular if L is regular.',
        topic: 'Power Operations',
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 'mcq-014',
    title: 'Minimization Algorithm',
    description: 'Deep dive into DFA minimization algorithms',
    difficulty: 'Hard',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is the first step in the table-filling minimization algorithm?',
        options: [
          'Mark all pairs as equivalent',
          'Mark pairs with one accepting and one non-accepting as distinguishable',
          'Mark all pairs as distinguishable',
          'Remove unreachable states'
        ],
        correctAnswer: 1,
        explanation: 'First, mark all pairs where one state is accepting and the other is not, as these are clearly distinguishable.',
        topic: 'Table-Filling Algorithm',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        question: 'In the table-filling algorithm, when do we mark a pair (p, q) as distinguishable?',
        options: [
          'When p and q have different transitions',
          'When δ(p, a) and δ(q, a) lead to a distinguishable pair for some symbol a',
          'When p = q',
          'When both are accepting'
        ],
        correctAnswer: 1,
        explanation: 'We mark (p, q) as distinguishable if, for some symbol a, the states δ(p, a) and δ(q, a) are distinguishable.',
        topic: 'Distinguishability',
        difficulty: 'Hard'
      },
      {
        id: 'q3',
        question: 'What happens to equivalent states after minimization?',
        options: [
          'They are merged into a single state',
          'They are removed',
          'They are kept separate',
          'They become accepting'
        ],
        correctAnswer: 0,
        explanation: 'Equivalent states are merged (combined) into a single state in the minimal DFA.',
        topic: 'State Merging',
        difficulty: 'Easy'
      },
      {
        id: 'q4',
        question: 'Is the minimal DFA unique for a given language?',
        options: [
          'Yes, up to isomorphism',
          'No, there can be many minimal DFAs',
          'Only for finite languages',
          'Only if the language is empty'
        ],
        correctAnswer: 0,
        explanation: 'The minimal DFA for a regular language is unique up to isomorphism (renaming of states).',
        topic: 'Uniqueness',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        question: 'What is the time complexity of the table-filling algorithm?',
        options: [
          'O(n)',
          'O(n log n)',
          'O(n²)',
          'O(2^n)'
        ],
        correctAnswer: 2,
        explanation: 'The table-filling algorithm compares all pairs of states, giving O(n²) time complexity where n is the number of states.',
        topic: 'Complexity',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'mcq-015',
    title: 'NFA to DFA Conversion',
    description: 'Master converting NFAs to equivalent DFAs',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'What is the algorithm used to convert an NFA to a DFA?',
        options: [
          'Kleene algorithm',
          'Subset construction',
          'Table-filling algorithm',
          'State elimination'
        ],
        correctAnswer: 1,
        explanation: 'Subset construction (also called powerset construction) is used to convert an NFA to an equivalent DFA.',
        topic: 'Conversion Algorithm',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'In subset construction, what does each state of the DFA represent?',
        options: [
          'A single state of the NFA',
          'A set of states of the NFA',
          'A transition of the NFA',
          'An accepting state of the NFA'
        ],
        correctAnswer: 1,
        explanation: 'Each state in the resulting DFA represents a set of states that the NFA could be in after reading some input.',
        topic: 'Subset Construction',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'What is the worst-case number of states in a DFA converted from an NFA with n states?',
        options: [
          'n states',
          'n² states',
          '2^n states',
          'n! states'
        ],
        correctAnswer: 2,
        explanation: 'In the worst case, the DFA can have up to 2^n states, representing all possible subsets of the NFA states.',
        topic: 'State Explosion',
        difficulty: 'Hard'
      },
      {
        id: 'q4',
        question: 'When is a state in the DFA accepting in subset construction?',
        options: [
          'When it contains the start state',
          'When it contains at least one accepting state of the NFA',
          'When it contains all accepting states',
          'When it has no transitions'
        ],
        correctAnswer: 1,
        explanation: 'A state in the DFA is accepting if the corresponding set of NFA states contains at least one accepting state.',
        topic: 'Accepting States',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        question: 'Can every NFA be converted to an equivalent DFA?',
        options: [
          'Yes, always',
          'No, only some can',
          'Only if it has no ε-transitions',
          'Only if it has fewer than 10 states'
        ],
        correctAnswer: 0,
        explanation: 'Yes, every NFA (including those with ε-transitions) can be converted to an equivalent DFA using subset construction.',
        topic: 'Convertibility',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'mcq-016',
    title: 'Language Complement',
    description: 'Understand complement operations on languages',
    difficulty: 'Medium',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'What is the complement of a language L over alphabet Σ?',
        options: [
          'All strings in L',
          'Σ* - L (all strings not in L)',
          'The reverse of L',
          'The empty set'
        ],
        correctAnswer: 1,
        explanation: 'The complement of L is the set of all strings over Σ that are not in L, denoted as Σ* - L.',
        topic: 'Complement Definition',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        question: 'How do you construct a DFA for the complement of a language?',
        options: [
          'Reverse all transitions',
          'Swap accepting and non-accepting states',
          'Add new states',
          'Remove all transitions'
        ],
        correctAnswer: 1,
        explanation: 'To get the complement, swap accepting and non-accepting states in the DFA for the original language.',
        topic: 'Complement Construction',
        difficulty: 'Medium'
      },
      {
        id: 'q3',
        question: 'Is the complement of a regular language always regular?',
        options: [
          'Yes',
          'No',
          'Only for finite languages',
          'Only for infinite languages'
        ],
        correctAnswer: 0,
        explanation: 'Yes, regular languages are closed under complement, so the complement of a regular language is also regular.',
        topic: 'Complement Closure',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'What is the complement of the empty language {} over {0, 1}?',
        options: [
          '{} (empty set)',
          '{ε}',
          'All strings over {0, 1}',
          '{0, 1}'
        ],
        correctAnswer: 2,
        explanation: 'The complement of the empty language is all strings over the alphabet, which is {0, 1}*.',
        topic: 'Empty Language Complement',
        difficulty: 'Medium',
        isTrick: true
      },
      {
        id: 'q5',
        question: 'What is the complement of the complement of language L?',
        options: [
          'L itself',
          'The empty language',
          'All strings',
          'Undefined'
        ],
        correctAnswer: 0,
        explanation: 'The complement of the complement of L is L itself, as (L^c)^c = L.',
        topic: 'Double Complement',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'mcq-017',
    title: 'Advanced FA Concepts',
    description: 'Test advanced concepts in finite automata theory',
    difficulty: 'Hard',
    status: 'unsolved',
    totalQuestions: 5,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is the Myhill-Nerode theorem used for?',
        options: [
          'To prove a language is regular',
          'To find the minimum number of states needed for a DFA',
          'To convert NFA to DFA',
          'To minimize a DFA'
        ],
        correctAnswer: 1,
        explanation: 'The Myhill-Nerode theorem determines the minimum number of states required for a DFA to recognize a language.',
        topic: 'Myhill-Nerode',
        difficulty: 'Hard'
      },
      {
        id: 'q2',
        question: 'What are Nerode equivalence classes?',
        options: [
          'Groups of equivalent states',
          'Groups of strings that are indistinguishable by the language',
          'Groups of accepting states',
          'Groups of transitions'
        ],
        correctAnswer: 1,
        explanation: 'Nerode equivalence classes group strings that cannot be distinguished by the language - they behave the same way with respect to acceptance.',
        topic: 'Equivalence Classes',
        difficulty: 'Hard'
      },
      {
        id: 'q3',
        question: 'What is the relationship between the number of Nerode equivalence classes and the minimum DFA size?',
        options: [
          'They are equal',
          'Classes = DFA states + 1',
          'DFA states = Classes - 1',
          'No relationship'
        ],
        correctAnswer: 0,
        explanation: 'The number of Nerode equivalence classes equals the minimum number of states needed for a DFA recognizing the language.',
        topic: 'Myhill-Nerode Application',
        difficulty: 'Hard'
      },
      {
        id: 'q4',
        question: 'What is a distinguishing extension?',
        options: [
          'A string that shows two states are different',
          'A string that extends the alphabet',
          'A state with many transitions',
          'An accepting state'
        ],
        correctAnswer: 0,
        explanation: 'A distinguishing extension is a string that, when appended to two different strings, shows they belong to different equivalence classes.',
        topic: 'Distinguishing Extensions',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        question: 'Can a language have infinitely many Nerode equivalence classes?',
        options: [
          'Yes, if it is regular',
          'No, regular languages have finitely many',
          'Only for context-free languages',
          'Only for infinite languages'
        ],
        correctAnswer: 1,
        explanation: 'No, if a language is regular, it has finitely many Nerode equivalence classes. Infinitely many classes indicate the language is not regular.',
        topic: 'Regularity Criterion',
        difficulty: 'Hard'
      }
    ]
  }
];

export const getProblemById = (id) => {
  return faProblems.find(p => p.id === id) || mcqQuizzes.find(q => q.id === id);
};

export const getAllProblems = () => {
  return [...faProblems];
};

export const getProblemsByFilter = (type, difficulty, status) => {
  let problems = [...faProblems];
  
  if (type && type !== 'all') {
    problems = problems.filter(p => p.type === type);
  }
  
  if (difficulty && difficulty !== 'all') {
    problems = problems.filter(p => p.difficulty === difficulty);
  }
  
  if (status && status !== 'all') {
    problems = problems.filter(p => p.status === status);
  }
  
  return problems;
};

export const getQuizzesByFilter = (difficulty, status) => {
  let quizzes = [...mcqQuizzes];
  
  if (difficulty && difficulty !== 'all') {
    quizzes = quizzes.filter(q => q.difficulty === difficulty);
  }
  
  if (status && status !== 'all') {
    quizzes = quizzes.filter(q => q.status === status);
  }
  
  return quizzes;
};

