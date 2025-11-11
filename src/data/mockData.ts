import { Subject, Concept, Question } from '@/types/quiz';

export const mockSubjects: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    description: 'Explore fundamental laws of nature and energy',
    iconUrl: '⚛️'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Master equations, calculus, and number theory',
    iconUrl: '∑'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Understand molecular structures and reactions',
    iconUrl: '🧪'
  }
];

export const mockConcepts: Record<string, Concept[]> = {
  physics: [
    {
      id: 'energy-mass',
      name: 'Mass-Energy Equivalence',
      formulaLatex: 'E = mc^2',
      explanation: 'Energy and mass are interchangeable; energy equals mass times the speed of light squared.'
    },
    {
      id: 'newton-second',
      name: "Newton's Second Law",
      formulaLatex: 'F = ma',
      explanation: 'Force equals mass times acceleration, describing how objects move under force.'
    },
    {
      id: 'kinetic-energy',
      name: 'Kinetic Energy',
      formulaLatex: 'KE = \\frac{1}{2}mv^2',
      explanation: 'The energy of motion depends on mass and velocity squared.'
    },
    {
      id: 'gravitational-force',
      name: 'Universal Gravitation',
      formulaLatex: 'F = G\\frac{m_1 m_2}{r^2}',
      explanation: 'Gravitational force between two masses inversely proportional to distance squared.'
    },
    {
      id: 'wave-equation',
      name: 'Wave Speed',
      formulaLatex: 'v = f\\lambda',
      explanation: 'Wave speed equals frequency times wavelength.'
    },
    {
      id: 'ohms-law',
      name: "Ohm's Law",
      formulaLatex: 'V = IR',
      explanation: 'Voltage equals current times resistance in electrical circuits.'
    }
  ],
  mathematics: [
    {
      id: 'pythagorean',
      name: 'Pythagorean Theorem',
      formulaLatex: 'a^2 + b^2 = c^2',
      explanation: 'In right triangles, the square of the hypotenuse equals the sum of squares of other sides.'
    },
    {
      id: 'quadratic-formula',
      name: 'Quadratic Formula',
      formulaLatex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
      explanation: 'Solves any quadratic equation of form ax² + bx + c = 0.'
    },
    {
      id: 'derivative-power',
      name: 'Power Rule Derivative',
      formulaLatex: '\\frac{d}{dx}x^n = nx^{n-1}',
      explanation: 'Derivative of x to the power n equals n times x to the power n-1.'
    },
    {
      id: 'euler-identity',
      name: "Euler's Identity",
      formulaLatex: 'e^{i\\pi} + 1 = 0',
      explanation: 'The most beautiful equation connecting five fundamental constants.'
    },
    {
      id: 'binomial-theorem',
      name: 'Binomial Theorem',
      formulaLatex: '(x+y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k',
      explanation: 'Expansion formula for powers of binomials.'
    },
    {
      id: 'law-of-cosines',
      name: 'Law of Cosines',
      formulaLatex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)',
      explanation: 'Relates sides and angles in any triangle.'
    }
  ]
};

export const mockQuestions: Record<string, Record<'easy' | 'medium' | 'hard', Question>> = {
  'energy-mass': {
    easy: {
      id: 'q-em-easy',
      conceptId: 'energy-mass',
      textLatex: 'In E = mc^2, what does "c" represent?',
      difficulty: 'easy',
      options: [
        { id: 'a', text: 'The speed of light' },
        { id: 'b', text: 'A constant of proportionality' },
        { id: 'c', text: 'The speed of sound' },
        { id: 'd', text: 'Coulomb force' }
      ]
    },
    medium: {
      id: 'q-em-med',
      conceptId: 'energy-mass',
      textLatex: 'If mass is 2 kg and c = 3 \\times 10^8 m/s, what is the energy (in Joules)?',
      difficulty: 'medium',
      options: [
        { id: 'a', text: '1.8 × 10¹⁷ J' },
        { id: 'b', text: '6 × 10⁸ J' },
        { id: 'c', text: '9 × 10¹⁶ J' },
        { id: 'd', text: '1.8 × 10⁸ J' }
      ]
    },
    hard: {
      id: 'q-em-hard',
      conceptId: 'energy-mass',
      textLatex: 'A particle with rest mass m_0 moves at 0.8c. What is its total energy?',
      difficulty: 'hard',
      options: [
        { id: 'a', text: '\\gamma m_0 c^2 where \\gamma = \\frac{5}{3}' },
        { id: 'b', text: 'm_0 c^2' },
        { id: 'c', text: '0.8 m_0 c^2' },
        { id: 'd', text: '\\gamma m_0 c^2 where \\gamma = 2' }
      ]
    }
  },
  'pythagorean': {
    easy: {
      id: 'q-py-easy',
      conceptId: 'pythagorean',
      textLatex: 'In a right triangle, if a = 3 and b = 4, what is c?',
      difficulty: 'easy',
      options: [
        { id: 'a', text: '5' },
        { id: 'b', text: '7' },
        { id: 'c', text: '6' },
        { id: 'd', text: '25' }
      ]
    },
    medium: {
      id: 'q-py-med',
      conceptId: 'pythagorean',
      textLatex: 'If c = 13 and a = 5, what is b?',
      difficulty: 'medium',
      options: [
        { id: 'a', text: '12' },
        { id: 'b', text: '8' },
        { id: 'c', text: '10' },
        { id: 'd', text: '144' }
      ]
    },
    hard: {
      id: 'q-py-hard',
      conceptId: 'pythagorean',
      textLatex: 'Prove the Pythagorean theorem using similar triangles. Which is the key step?',
      difficulty: 'hard',
      options: [
        { id: 'a', text: 'Drop altitude from right angle to hypotenuse, creating similar triangles' },
        { id: 'b', text: 'Use trigonometric identities' },
        { id: 'c', text: 'Apply calculus differentiation' },
        { id: 'd', text: 'Sum interior angles' }
      ]
    }
  }
};

// Mock correct answers
export const mockAnswers: Record<string, string> = {
  'q-em-easy': 'a',
  'q-em-med': 'a',
  'q-em-hard': 'a',
  'q-py-easy': 'a',
  'q-py-med': 'a',
  'q-py-hard': 'a'
};
