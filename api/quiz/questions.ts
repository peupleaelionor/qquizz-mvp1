import type { VercelRequest, VercelResponse } from '@vercel/node';

const sampleQuestions = [
  {
    id: '1',
    question: 'Quelle est la capitale de la République Démocratique du Congo ?',
    options: ['Brazzaville', 'Kinshasa', 'Lubumbashi', 'Goma'],
    correctAnswer: 1,
    category: 'Géographie',
    difficulty: 'easy',
    points: 10,
    explanation: 'Kinshasa est la capitale et la plus grande ville de la RDC, située sur le fleuve Congo.'
  },
  {
    id: '2',
    question: 'Qui a écrit "L\'Aventure ambiguë" ?',
    options: ['Cheikh Hamidou Kane', 'Léopold Sédar Senghor', 'Aimé Césaire', 'Mongo Beti'],
    correctAnswer: 0,
    category: 'Littérature',
    difficulty: 'medium',
    points: 20,
    explanation: 'Cheikh Hamidou Kane est un écrivain sénégalais, auteur de ce roman philosophique publié en 1961.'
  },
  {
    id: '3',
    question: 'En quelle année l\'Afrique du Sud a-t-elle mis fin à l\'apartheid ?',
    options: ['1989', '1991', '1994', '1996'],
    correctAnswer: 2,
    category: 'Histoire',
    difficulty: 'medium',
    points: 20,
    explanation: 'L\'apartheid a officiellement pris fin en 1994 avec les premières élections démocratiques et l\'élection de Nelson Mandela.'
  },
  {
    id: '4',
    question: 'Quel est le plus long fleuve d\'Afrique ?',
    options: ['Le Congo', 'Le Niger', 'Le Nil', 'Le Zambèze'],
    correctAnswer: 2,
    category: 'Géographie',
    difficulty: 'easy',
    points: 10,
    explanation: 'Le Nil est le plus long fleuve d\'Afrique avec environ 6 650 km, traversant 11 pays.'
  },
  {
    id: '5',
    question: 'Qui était Patrice Lumumba ?',
    options: [
      'Un musicien congolais',
      'Le premier Premier ministre du Congo indépendant',
      'Un écrivain africain',
      'Un athlète olympique'
    ],
    correctAnswer: 1,
    category: 'Histoire',
    difficulty: 'medium',
    points: 20,
    explanation: 'Patrice Lumumba fut le premier Premier ministre de la République du Congo indépendante en 1960.'
  },
  {
    id: '6',
    question: 'Quelle est la monnaie utilisée au Sénégal ?',
    options: ['Le Franc CFA', 'Le Dirham', 'Le Rand', 'Le Shilling'],
    correctAnswer: 0,
    category: 'Économie',
    difficulty: 'easy',
    points: 10,
    explanation: 'Le Franc CFA (Communauté Financière Africaine) est la monnaie commune de plusieurs pays d\'Afrique de l\'Ouest.'
  },
  {
    id: '7',
    question: 'Quel pays africain n\'a jamais été colonisé ?',
    options: ['Le Ghana', 'L\'Éthiopie', 'Le Nigeria', 'Le Kenya'],
    correctAnswer: 1,
    category: 'Histoire',
    difficulty: 'hard',
    points: 30,
    explanation: 'L\'Éthiopie est le seul pays africain à n\'avoir jamais été colonisé, à l\'exception d\'une brève occupation italienne (1936-1941).'
  },
  {
    id: '8',
    question: 'Quelle est la langue officielle du Mozambique ?',
    options: ['L\'anglais', 'Le français', 'Le portugais', 'L\'espagnol'],
    correctAnswer: 2,
    category: 'Culture',
    difficulty: 'medium',
    points: 20,
    explanation: 'Le portugais est la langue officielle du Mozambique, héritage de la colonisation portugaise.'
  },
  {
    id: '9',
    question: 'Quel musicien congolais est surnommé "Le Grand Maître" ?',
    options: ['Papa Wemba', 'Franco Luambo', 'Koffi Olomide', 'Tabu Ley Rochereau'],
    correctAnswer: 1,
    category: 'Musique',
    difficulty: 'medium',
    points: 20,
    explanation: 'Franco Luambo Makiadi, dit "Le Grand Maître", est une légende de la rumba congolaise.'
  },
  {
    id: '10',
    question: 'Quelle est la plus haute montagne d\'Afrique ?',
    options: ['Le Mont Kenya', 'Le Kilimandjaro', 'Le Mont Cameroun', 'Le Ras Dashen'],
    correctAnswer: 1,
    category: 'Géographie',
    difficulty: 'easy',
    points: 10,
    explanation: 'Le Kilimandjaro en Tanzanie culmine à 5 895 mètres, ce qui en fait le plus haut sommet d\'Afrique.'
  }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, difficulty, limit = '10' } = req.query;

    let questions = [...sampleQuestions];

    if (category && typeof category === 'string') {
      questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && typeof difficulty === 'string') {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    const limitNum = parseInt(limit as string, 10);
    questions = questions.slice(0, limitNum);

    questions = questions.sort(() => Math.random() - 0.5);

    return res.status(200).json({
      success: true,
      questions,
      total: questions.length
    });
  } catch (error) {
    console.error('Questions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
