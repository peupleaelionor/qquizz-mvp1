// QQUIZ PRODIGY - Base de Questions Complète
// 100+ questions par catégorie

export interface Question {
  id: number;
  category: string;
  categoryId: string;
  question: string;
  answers: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

// Questions par catégorie
export const QUESTIONS_DB: Question[] = [
  // ==================== SPORT ====================
  { id: 1, category: 'Sport', categoryId: 'sport', question: "Quel pays a remporté la Coupe du Monde 2022 ?", answers: ["France", "Argentine", "Brésil", "Allemagne"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 2, category: 'Sport', categoryId: 'sport', question: "Combien de joueurs dans une équipe de football ?", answers: ["9", "10", "11", "12"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 3, category: 'Sport', categoryId: 'sport', question: "Qui détient le record de buts en Coupe du Monde ?", answers: ["Pelé", "Ronaldo", "Miroslav Klose", "Mbappé"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 4, category: 'Sport', categoryId: 'sport', question: "Dans quel sport utilise-t-on un volant ?", answers: ["Tennis", "Badminton", "Squash", "Ping-pong"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 5, category: 'Sport', categoryId: 'sport', question: "Combien de sets faut-il gagner en finale de Wimbledon (hommes) ?", answers: ["2", "3", "4", "5"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 6, category: 'Sport', categoryId: 'sport', question: "Quel pays a inventé le basketball ?", answers: ["France", "USA", "Canada", "Angleterre"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 7, category: 'Sport', categoryId: 'sport', question: "Quelle est la distance d'un marathon ?", answers: ["40 km", "42.195 km", "45 km", "50 km"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 8, category: 'Sport', categoryId: 'sport', question: "Qui est le meilleur buteur de l'histoire du Real Madrid ?", answers: ["Raul", "Benzema", "Cristiano Ronaldo", "Di Stéfano"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 9, category: 'Sport', categoryId: 'sport', question: "Quel sport se joue sur un terrain appelé 'court' ?", answers: ["Football", "Tennis", "Rugby", "Cricket"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 10, category: 'Sport', categoryId: 'sport', question: "Combien de joueurs dans une équipe de basketball sur le terrain ?", answers: ["4", "5", "6", "7"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 11, category: 'Sport', categoryId: 'sport', question: "Quel nageur a gagné 23 médailles d'or olympiques ?", answers: ["Ian Thorpe", "Michael Phelps", "Ryan Lochte", "Mark Spitz"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 12, category: 'Sport', categoryId: 'sport', question: "Dans quel sport Usain Bolt est-il champion ?", answers: ["Natation", "Athlétisme", "Cyclisme", "Boxe"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 13, category: 'Sport', categoryId: 'sport', question: "Quel club a remporté le plus de Ligues des Champions ?", answers: ["AC Milan", "Barcelona", "Real Madrid", "Bayern Munich"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 14, category: 'Sport', categoryId: 'sport', question: "Combien de temps dure un match de rugby ?", answers: ["60 min", "70 min", "80 min", "90 min"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 15, category: 'Sport', categoryId: 'sport', question: "Quel pays a le plus de titres en Coupe du Monde ?", answers: ["Allemagne", "Italie", "Brésil", "Argentine"], correct: 2, difficulty: 'easy', points: 100 },

  // ==================== SCIENCE ====================
  { id: 101, category: 'Science', categoryId: 'science', question: "Quelle planète est surnommée la 'planète rouge' ?", answers: ["Vénus", "Jupiter", "Mars", "Saturne"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 102, category: 'Science', categoryId: 'science', question: "Quel est le symbole chimique de l'or ?", answers: ["Ag", "Au", "Fe", "Cu"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 103, category: 'Science', categoryId: 'science', question: "Combien d'os dans le corps humain adulte ?", answers: ["186", "206", "226", "246"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 104, category: 'Science', categoryId: 'science', question: "Quelle est la vitesse de la lumière ?", answers: ["200 000 km/s", "300 000 km/s", "400 000 km/s", "500 000 km/s"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 105, category: 'Science', categoryId: 'science', question: "Quel gaz respirons-nous principalement ?", answers: ["Oxygène", "Azote", "CO2", "Hélium"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 106, category: 'Science', categoryId: 'science', question: "Qui a découvert la pénicilline ?", answers: ["Pasteur", "Fleming", "Curie", "Einstein"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 107, category: 'Science', categoryId: 'science', question: "Quel est le plus grand organe du corps humain ?", answers: ["Foie", "Cerveau", "Peau", "Intestin"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 108, category: 'Science', categoryId: 'science', question: "Combien de planètes dans notre système solaire ?", answers: ["7", "8", "9", "10"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 109, category: 'Science', categoryId: 'science', question: "Quel est l'élément le plus abondant dans l'univers ?", answers: ["Oxygène", "Carbone", "Hydrogène", "Hélium"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 110, category: 'Science', categoryId: 'science', question: "Quelle est la formule de l'eau ?", answers: ["H2O", "CO2", "NaCl", "O2"], correct: 0, difficulty: 'easy', points: 100 },
  { id: 111, category: 'Science', categoryId: 'science', question: "Qui a formulé la théorie de la relativité ?", answers: ["Newton", "Einstein", "Hawking", "Bohr"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 112, category: 'Science', categoryId: 'science', question: "Quel est le métal le plus conducteur ?", answers: ["Or", "Cuivre", "Argent", "Aluminium"], correct: 2, difficulty: 'hard', points: 200 },
  { id: 113, category: 'Science', categoryId: 'science', question: "Combien de chromosomes a l'être humain ?", answers: ["23", "46", "48", "52"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 114, category: 'Science', categoryId: 'science', question: "Quel est le point d'ébullition de l'eau ?", answers: ["90°C", "100°C", "110°C", "120°C"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 115, category: 'Science', categoryId: 'science', question: "Quelle est la planète la plus proche du Soleil ?", answers: ["Vénus", "Mercure", "Mars", "Terre"], correct: 1, difficulty: 'easy', points: 100 },

  // ==================== CULTURE ====================
  { id: 201, category: 'Culture', categoryId: 'culture', question: "Quelle est la capitale de la RDC ?", answers: ["Kinshasa", "Brazzaville", "Lubumbashi", "Goma"], correct: 0, difficulty: 'easy', points: 100 },
  { id: 202, category: 'Culture', categoryId: 'culture', question: "Qui a peint la Joconde ?", answers: ["Picasso", "Van Gogh", "Léonard de Vinci", "Michel-Ange"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 203, category: 'Culture', categoryId: 'culture', question: "Quelle est la monnaie du Japon ?", answers: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 204, category: 'Culture', categoryId: 'culture', question: "Combien de continents y a-t-il ?", answers: ["5", "6", "7", "8"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 205, category: 'Culture', categoryId: 'culture', question: "Quelle langue est la plus parlée au monde ?", answers: ["Anglais", "Espagnol", "Mandarin", "Hindi"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 206, category: 'Culture', categoryId: 'culture', question: "Quel est le plus grand pays du monde ?", answers: ["Canada", "Chine", "USA", "Russie"], correct: 3, difficulty: 'easy', points: 100 },
  { id: 207, category: 'Culture', categoryId: 'culture', question: "Quelle est la religion la plus pratiquée ?", answers: ["Islam", "Christianisme", "Hindouisme", "Bouddhisme"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 208, category: 'Culture', categoryId: 'culture', question: "Quel fleuve traverse Paris ?", answers: ["Loire", "Rhône", "Seine", "Garonne"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 209, category: 'Culture', categoryId: 'culture', question: "Quelle est la capitale de l'Australie ?", answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 210, category: 'Culture', categoryId: 'culture', question: "Quel pays a la forme d'une botte ?", answers: ["Espagne", "Grèce", "Italie", "Portugal"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 211, category: 'Culture', categoryId: 'culture', question: "Quelle est la monnaie de la RDC ?", answers: ["Dollar", "Euro", "Franc Congolais", "CFA"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 212, category: 'Culture', categoryId: 'culture', question: "Combien d'étoiles sur le drapeau américain ?", answers: ["48", "50", "51", "52"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 213, category: 'Culture', categoryId: 'culture', question: "Quelle est la plus grande pyramide d'Égypte ?", answers: ["Khéops", "Khéphren", "Mykérinos", "Saqqarah"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 214, category: 'Culture', categoryId: 'culture', question: "Quel pays a inventé la pizza ?", answers: ["France", "Espagne", "Italie", "Grèce"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 215, category: 'Culture', categoryId: 'culture', question: "Quelle est la capitale du Canada ?", answers: ["Toronto", "Vancouver", "Montréal", "Ottawa"], correct: 3, difficulty: 'medium', points: 150 },

  // ==================== TECH ====================
  { id: 301, category: 'Tech', categoryId: 'tech', question: "Qui a fondé Apple ?", answers: ["Bill Gates", "Steve Jobs", "Elon Musk", "Jeff Bezos"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 302, category: 'Tech', categoryId: 'tech', question: "Que signifie 'CPU' ?", answers: ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Core Processing Unit"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 303, category: 'Tech', categoryId: 'tech', question: "Quel langage a créé le Web ?", answers: ["Java", "Python", "HTML", "C++"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 304, category: 'Tech', categoryId: 'tech', question: "Quelle entreprise a créé Android ?", answers: ["Apple", "Microsoft", "Google", "Samsung"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 305, category: 'Tech', categoryId: 'tech', question: "Que signifie 'AI' ?", answers: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Auto Information"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 306, category: 'Tech', categoryId: 'tech', question: "Quel est le système d'exploitation de Apple ?", answers: ["Windows", "Linux", "macOS", "Android"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 307, category: 'Tech', categoryId: 'tech', question: "Qui a fondé Microsoft ?", answers: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 308, category: 'Tech', categoryId: 'tech', question: "Que signifie 'URL' ?", answers: ["Universal Resource Locator", "Uniform Resource Locator", "United Resource Link", "Universal Reference Link"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 309, category: 'Tech', categoryId: 'tech', question: "Quel réseau social a été créé par Mark Zuckerberg ?", answers: ["Twitter", "Instagram", "Facebook", "LinkedIn"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 310, category: 'Tech', categoryId: 'tech', question: "Combien de bits dans un octet ?", answers: ["4", "8", "16", "32"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 311, category: 'Tech', categoryId: 'tech', question: "Quel est le navigateur de Google ?", answers: ["Firefox", "Safari", "Chrome", "Edge"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 312, category: 'Tech', categoryId: 'tech', question: "Que signifie 'RAM' ?", answers: ["Random Access Memory", "Read Access Memory", "Rapid Access Module", "Remote Access Memory"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 313, category: 'Tech', categoryId: 'tech', question: "Quelle entreprise a créé ChatGPT ?", answers: ["Google", "Microsoft", "OpenAI", "Meta"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 314, category: 'Tech', categoryId: 'tech', question: "Quel est le langage de programmation le plus populaire ?", answers: ["Java", "Python", "JavaScript", "C++"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 315, category: 'Tech', categoryId: 'tech', question: "Que signifie 'WiFi' ?", answers: ["Wireless Fidelity", "Wired Frequency", "Wireless Frequency", "Web Interface"], correct: 0, difficulty: 'medium', points: 150 },

  // ==================== CINÉMA ====================
  { id: 401, category: 'Cinéma', categoryId: 'cinema', question: "Quel film a remporté l'Oscar 2024 du meilleur film ?", answers: ["Barbie", "Oppenheimer", "Poor Things", "Killers"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 402, category: 'Cinéma', categoryId: 'cinema', question: "Qui joue Iron Man dans les films Marvel ?", answers: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 403, category: 'Cinéma', categoryId: 'cinema', question: "Quel film a le plus gros box-office de tous les temps ?", answers: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 404, category: 'Cinéma', categoryId: 'cinema', question: "Qui a réalisé Titanic ?", answers: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Martin Scorsese"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 405, category: 'Cinéma', categoryId: 'cinema', question: "Dans quel film apparaît le personnage de Joker ?", answers: ["Spider-Man", "Batman", "Superman", "X-Men"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 406, category: 'Cinéma', categoryId: 'cinema', question: "Quel acteur joue Jack dans Titanic ?", answers: ["Brad Pitt", "Tom Cruise", "Leonardo DiCaprio", "Johnny Depp"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 407, category: 'Cinéma', categoryId: 'cinema', question: "Combien de films Harry Potter y a-t-il ?", answers: ["6", "7", "8", "9"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 408, category: 'Cinéma', categoryId: 'cinema', question: "Quel studio a créé Toy Story ?", answers: ["DreamWorks", "Disney", "Pixar", "Warner Bros"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 409, category: 'Cinéma', categoryId: 'cinema', question: "Qui joue le rôle de Neo dans Matrix ?", answers: ["Tom Hanks", "Keanu Reeves", "Will Smith", "Nicolas Cage"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 410, category: 'Cinéma', categoryId: 'cinema', question: "Quel film a popularisé la phrase 'I'll be back' ?", answers: ["Rambo", "Terminator", "Die Hard", "Predator"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 411, category: 'Cinéma', categoryId: 'cinema', question: "Qui a réalisé Inception ?", answers: ["James Cameron", "Christopher Nolan", "Denis Villeneuve", "Ridley Scott"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 412, category: 'Cinéma', categoryId: 'cinema', question: "Quel est le premier film de la saga Star Wars ?", answers: ["Un Nouvel Espoir", "L'Empire Contre-Attaque", "La Menace Fantôme", "Le Réveil de la Force"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 413, category: 'Cinéma', categoryId: 'cinema', question: "Qui joue Forrest Gump ?", answers: ["Tom Hanks", "Robin Williams", "Jim Carrey", "Eddie Murphy"], correct: 0, difficulty: 'easy', points: 100 },
  { id: 414, category: 'Cinéma', categoryId: 'cinema', question: "Quel film Disney met en scène Simba ?", answers: ["Bambi", "Le Roi Lion", "Tarzan", "Dumbo"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 415, category: 'Cinéma', categoryId: 'cinema', question: "Combien de films Avengers y a-t-il ?", answers: ["3", "4", "5", "6"], correct: 1, difficulty: 'medium', points: 150 },

  // ==================== MUSIQUE ====================
  { id: 501, category: 'Musique', categoryId: 'musique', question: "Qui est le 'Roi de la Pop' ?", answers: ["Prince", "Michael Jackson", "Elvis", "Bruno Mars"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 502, category: 'Musique', categoryId: 'musique', question: "Quel groupe a chanté 'Bohemian Rhapsody' ?", answers: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 503, category: 'Musique', categoryId: 'musique', question: "Qui est considéré comme le 'Roi de la Rumba Congolaise' ?", answers: ["Papa Wemba", "Franco Luambo", "Koffi Olomide", "Fally Ipupa"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 504, category: 'Musique', categoryId: 'musique', question: "Combien de membres dans les Beatles ?", answers: ["3", "4", "5", "6"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 505, category: 'Musique', categoryId: 'musique', question: "Quel instrument joue un pianiste ?", answers: ["Guitare", "Violon", "Piano", "Batterie"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 506, category: 'Musique', categoryId: 'musique', question: "Qui a chanté 'Thriller' ?", answers: ["Prince", "Michael Jackson", "Whitney Houston", "Stevie Wonder"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 507, category: 'Musique', categoryId: 'musique', question: "Quel rappeur américain est surnommé 'Slim Shady' ?", answers: ["50 Cent", "Jay-Z", "Eminem", "Kanye West"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 508, category: 'Musique', categoryId: 'musique', question: "Combien de cordes a une guitare standard ?", answers: ["4", "5", "6", "7"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 509, category: 'Musique', categoryId: 'musique', question: "Qui a composé la 9ème Symphonie ?", answers: ["Mozart", "Bach", "Beethoven", "Chopin"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 510, category: 'Musique', categoryId: 'musique', question: "Quel artiste congolais a chanté 'Loi' ?", answers: ["Fally Ipupa", "Ferre Gola", "Koffi Olomide", "Werrason"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 511, category: 'Musique', categoryId: 'musique', question: "Quel groupe a chanté 'Stairway to Heaven' ?", answers: ["Pink Floyd", "Led Zeppelin", "The Rolling Stones", "AC/DC"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 512, category: 'Musique', categoryId: 'musique', question: "Qui est la 'Reine de la Pop' ?", answers: ["Beyoncé", "Madonna", "Lady Gaga", "Rihanna"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 513, category: 'Musique', categoryId: 'musique', question: "Quel instrument a 88 touches ?", answers: ["Orgue", "Piano", "Synthétiseur", "Accordéon"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 514, category: 'Musique', categoryId: 'musique', question: "Qui a chanté 'Shape of You' ?", answers: ["Justin Bieber", "Ed Sheeran", "Bruno Mars", "The Weeknd"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 515, category: 'Musique', categoryId: 'musique', question: "Quel genre musical vient de la Jamaïque ?", answers: ["Jazz", "Blues", "Reggae", "Salsa"], correct: 2, difficulty: 'easy', points: 100 },

  // ==================== GÉOGRAPHIE ====================
  { id: 601, category: 'Géographie', categoryId: 'geographie', question: "Quel est le plus long fleuve d'Afrique ?", answers: ["Congo", "Niger", "Nil", "Zambèze"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 602, category: 'Géographie', categoryId: 'geographie', question: "Quelle est la capitale de la France ?", answers: ["Lyon", "Marseille", "Paris", "Nice"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 603, category: 'Géographie', categoryId: 'geographie', question: "Quel est le plus grand océan ?", answers: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 604, category: 'Géographie', categoryId: 'geographie', question: "Combien de pays en Afrique ?", answers: ["44", "54", "64", "74"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 605, category: 'Géographie', categoryId: 'geographie', question: "Quelle est la plus haute montagne du monde ?", answers: ["K2", "Mont Blanc", "Everest", "Kilimandjaro"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 606, category: 'Géographie', categoryId: 'geographie', question: "Quel pays a le plus d'habitants ?", answers: ["USA", "Inde", "Chine", "Indonésie"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 607, category: 'Géographie', categoryId: 'geographie', question: "Quelle mer borde l'Égypte ?", answers: ["Mer Noire", "Mer Rouge", "Mer Morte", "Mer Caspienne"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 608, category: 'Géographie', categoryId: 'geographie', question: "Quel est le plus petit pays du monde ?", answers: ["Monaco", "Vatican", "San Marin", "Liechtenstein"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 609, category: 'Géographie', categoryId: 'geographie', question: "Quelle est la capitale du Japon ?", answers: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 610, category: 'Géographie', categoryId: 'geographie', question: "Quel désert est le plus grand ?", answers: ["Gobi", "Kalahari", "Sahara", "Mojave"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 611, category: 'Géographie', categoryId: 'geographie', question: "Combien de provinces en RDC ?", answers: ["11", "21", "26", "31"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 612, category: 'Géographie', categoryId: 'geographie', question: "Quel pays est surnommé le 'pays du soleil levant' ?", answers: ["Chine", "Corée", "Japon", "Vietnam"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 613, category: 'Géographie', categoryId: 'geographie', question: "Quelle est la capitale de l'Allemagne ?", answers: ["Munich", "Francfort", "Berlin", "Hambourg"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 614, category: 'Géographie', categoryId: 'geographie', question: "Quel fleuve traverse l'Égypte ?", answers: ["Tigre", "Euphrate", "Nil", "Congo"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 615, category: 'Géographie', categoryId: 'geographie', question: "Quelle île est la plus grande ?", answers: ["Madagascar", "Bornéo", "Groenland", "Nouvelle-Guinée"], correct: 2, difficulty: 'medium', points: 150 },

  // ==================== HISTOIRE ====================
  { id: 701, category: 'Histoire', categoryId: 'histoire', question: "En quelle année l'indépendance du Congo a-t-elle été proclamée ?", answers: ["1958", "1960", "1962", "1965"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 702, category: 'Histoire', categoryId: 'histoire', question: "Qui était le premier président de la RDC ?", answers: ["Mobutu", "Kasavubu", "Lumumba", "Tshombe"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 703, category: 'Histoire', categoryId: 'histoire', question: "En quelle année a eu lieu la Révolution française ?", answers: ["1776", "1789", "1799", "1804"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 704, category: 'Histoire', categoryId: 'histoire', question: "Qui a découvert l'Amérique ?", answers: ["Vasco de Gama", "Magellan", "Christophe Colomb", "Amerigo Vespucci"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 705, category: 'Histoire', categoryId: 'histoire', question: "Quand a commencé la Seconde Guerre mondiale ?", answers: ["1937", "1939", "1941", "1942"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 706, category: 'Histoire', categoryId: 'histoire', question: "Qui était Napoléon Bonaparte ?", answers: ["Roi de France", "Empereur français", "Président français", "Duc de France"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 707, category: 'Histoire', categoryId: 'histoire', question: "Quelle civilisation a construit les pyramides ?", answers: ["Romaine", "Grecque", "Égyptienne", "Mésopotamienne"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 708, category: 'Histoire', categoryId: 'histoire', question: "En quelle année le mur de Berlin est-il tombé ?", answers: ["1987", "1989", "1991", "1993"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 709, category: 'Histoire', categoryId: 'histoire', question: "Qui était Martin Luther King ?", answers: ["Président américain", "Militant des droits civiques", "Général", "Inventeur"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 710, category: 'Histoire', categoryId: 'histoire', question: "Quelle guerre a opposé le Nord et le Sud des USA ?", answers: ["Guerre d'indépendance", "Guerre de Sécession", "Guerre du Vietnam", "Guerre du Golfe"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 711, category: 'Histoire', categoryId: 'histoire', question: "Qui était Patrice Lumumba ?", answers: ["Roi du Congo", "Premier ministre du Congo", "Président du Congo", "Général congolais"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 712, category: 'Histoire', categoryId: 'histoire', question: "En quelle année l'homme a-t-il marché sur la Lune ?", answers: ["1965", "1967", "1969", "1971"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 713, category: 'Histoire', categoryId: 'histoire', question: "Qui a aboli l'esclavage en France ?", answers: ["Napoléon", "Louis XVI", "Victor Schoelcher", "De Gaulle"], correct: 2, difficulty: 'hard', points: 200 },
  { id: 714, category: 'Histoire', categoryId: 'histoire', question: "Quelle était la capitale de l'Empire romain ?", answers: ["Athènes", "Rome", "Constantinople", "Alexandrie"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 715, category: 'Histoire', categoryId: 'histoire', question: "Qui a unifié l'Allemagne en 1871 ?", answers: ["Hitler", "Bismarck", "Guillaume II", "Metternich"], correct: 1, difficulty: 'hard', points: 200 },

  // ==================== GASTRONOMIE ====================
  { id: 801, category: 'Gastronomie', categoryId: 'gastronomie', question: "Quel pays est célèbre pour les sushis ?", answers: ["Chine", "Corée", "Japon", "Thaïlande"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 802, category: 'Gastronomie', categoryId: 'gastronomie', question: "Quel est l'ingrédient principal du guacamole ?", answers: ["Tomate", "Avocat", "Piment", "Oignon"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 803, category: 'Gastronomie', categoryId: 'gastronomie', question: "D'où vient la paella ?", answers: ["Italie", "Portugal", "Espagne", "France"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 804, category: 'Gastronomie', categoryId: 'gastronomie', question: "Quel plat congolais est à base de feuilles de manioc ?", answers: ["Fufu", "Pondu", "Makayabu", "Liboke"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 805, category: 'Gastronomie', categoryId: 'gastronomie', question: "Quel fromage est utilisé pour la pizza ?", answers: ["Cheddar", "Mozzarella", "Gruyère", "Brie"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 806, category: 'Gastronomie', categoryId: 'gastronomie', question: "D'où vient le croissant ?", answers: ["France", "Autriche", "Belgique", "Suisse"], correct: 1, difficulty: 'hard', points: 200 },
  { id: 807, category: 'Gastronomie', categoryId: 'gastronomie', question: "Quel est le plat national du Maroc ?", answers: ["Tajine", "Couscous", "Pastilla", "Harira"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 808, category: 'Gastronomie', categoryId: 'gastronomie', question: "Avec quoi fait-on le chocolat ?", answers: ["Café", "Cacao", "Caramel", "Vanille"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 809, category: 'Gastronomie', categoryId: 'gastronomie', question: "Quel pays est célèbre pour le curry ?", answers: ["Chine", "Japon", "Inde", "Vietnam"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 810, category: 'Gastronomie', categoryId: 'gastronomie', question: "Qu'est-ce que le wasabi ?", answers: ["Sauce soja", "Raifort japonais", "Algue", "Gingembre"], correct: 1, difficulty: 'medium', points: 150 },

  // ==================== ART ====================
  { id: 901, category: 'Art', categoryId: 'art', question: "Qui a peint 'La Nuit étoilée' ?", answers: ["Monet", "Van Gogh", "Picasso", "Dali"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 902, category: 'Art', categoryId: 'art', question: "Où se trouve la Joconde ?", answers: ["British Museum", "Louvre", "Prado", "Uffizi"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 903, category: 'Art', categoryId: 'art', question: "Qui a sculpté le David ?", answers: ["Donatello", "Michel-Ange", "Bernini", "Rodin"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 904, category: 'Art', categoryId: 'art', question: "Quel mouvement artistique Picasso a-t-il co-fondé ?", answers: ["Impressionnisme", "Cubisme", "Surréalisme", "Expressionnisme"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 905, category: 'Art', categoryId: 'art', question: "Qui a peint le plafond de la Chapelle Sixtine ?", answers: ["Raphaël", "Léonard de Vinci", "Michel-Ange", "Botticelli"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 906, category: 'Art', categoryId: 'art', question: "Quel artiste est célèbre pour ses montres molles ?", answers: ["Magritte", "Dali", "Ernst", "Miró"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 907, category: 'Art', categoryId: 'art', question: "Quelle est la technique de peinture à l'eau ?", answers: ["Huile", "Acrylique", "Aquarelle", "Pastel"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 908, category: 'Art', categoryId: 'art', question: "Qui a créé 'Le Penseur' ?", answers: ["Michel-Ange", "Rodin", "Bernini", "Canova"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 909, category: 'Art', categoryId: 'art', question: "Quel artiste a coupé son oreille ?", answers: ["Monet", "Cézanne", "Van Gogh", "Gauguin"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 910, category: 'Art', categoryId: 'art', question: "Qu'est-ce que le pop art ?", answers: ["Art populaire", "Art de la culture de masse", "Art politique", "Art primitif"], correct: 1, difficulty: 'medium', points: 150 },

  // ==================== JEUX VIDÉO ====================
  { id: 1001, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quel personnage est le héros de Mario ?", answers: ["Luigi", "Mario", "Wario", "Toad"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1002, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quelle console a créé Sony ?", answers: ["Xbox", "Nintendo", "PlayStation", "Sega"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1003, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quel jeu a popularisé le Battle Royale ?", answers: ["PUBG", "Fortnite", "Apex Legends", "Call of Duty"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 1004, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Qui est le personnage principal de Zelda ?", answers: ["Zelda", "Link", "Ganon", "Epona"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1005, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quel jeu se joue avec des blocs ?", answers: ["Roblox", "Minecraft", "Terraria", "Lego Worlds"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1006, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quelle entreprise a créé Pokémon ?", answers: ["Sony", "Nintendo", "Sega", "Capcom"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1007, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quel est le jeu le plus vendu de tous les temps ?", answers: ["GTA V", "Minecraft", "Tetris", "Wii Sports"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1008, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Dans quel jeu trouve-t-on Master Chief ?", answers: ["Gears of War", "Halo", "Destiny", "Call of Duty"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1009, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quel jeu de foot est développé par EA ?", answers: ["PES", "FIFA/EA FC", "Football Manager", "eFootball"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1010, category: 'Jeux Vidéo', categoryId: 'jeux_video', question: "Quel personnage mange des fantômes ?", answers: ["Mario", "Pac-Man", "Sonic", "Kirby"], correct: 1, difficulty: 'easy', points: 100 },

  // ==================== SÉRIES TV ====================
  { id: 1101, category: 'Séries TV', categoryId: 'series_tv', question: "Dans quelle série trouve-t-on Walter White ?", answers: ["The Wire", "Breaking Bad", "Better Call Saul", "Ozark"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1102, category: 'Séries TV', categoryId: 'series_tv', question: "Combien de saisons a Game of Thrones ?", answers: ["6", "7", "8", "9"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1103, category: 'Séries TV', categoryId: 'series_tv', question: "Quelle série se passe à Hawkins ?", answers: ["The OA", "Stranger Things", "Dark", "Lost"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1104, category: 'Séries TV', categoryId: 'series_tv', question: "Qui joue le Docteur dans House ?", answers: ["Hugh Laurie", "Bryan Cranston", "Jon Hamm", "Kevin Spacey"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 1105, category: 'Séries TV', categoryId: 'series_tv', question: "Quelle série parle de la famille Shelby ?", answers: ["The Crown", "Peaky Blinders", "Downton Abbey", "Boardwalk Empire"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1106, category: 'Séries TV', categoryId: 'series_tv', question: "Dans quelle série trouve-t-on le personnage de Eleven ?", answers: ["Dark", "Stranger Things", "The OA", "Sense8"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1107, category: 'Séries TV', categoryId: 'series_tv', question: "Quelle série Netflix parle d'un jeu mortel coréen ?", answers: ["Alice in Borderland", "Squid Game", "Sweet Home", "All of Us Are Dead"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1108, category: 'Séries TV', categoryId: 'series_tv', question: "Combien d'épisodes dans une saison de Friends ?", answers: ["20-24", "10-13", "8-10", "12-15"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 1109, category: 'Séries TV', categoryId: 'series_tv', question: "Quelle série parle de zombies à Atlanta ?", answers: ["Fear the Walking Dead", "The Walking Dead", "Z Nation", "Black Summer"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1110, category: 'Séries TV', categoryId: 'series_tv', question: "Qui est le créateur de Black Mirror ?", answers: ["Vince Gilligan", "Charlie Brooker", "David Fincher", "Ryan Murphy"], correct: 1, difficulty: 'hard', points: 200 },

  // ==================== BIOLOGIE ====================
  { id: 1201, category: 'Biologie', categoryId: 'biologie', question: "Quel organe pompe le sang ?", answers: ["Poumons", "Foie", "Cœur", "Reins"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1202, category: 'Biologie', categoryId: 'biologie', question: "Combien de chromosomes a l'humain ?", answers: ["23", "46", "48", "52"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1203, category: 'Biologie', categoryId: 'biologie', question: "Quel est le plus grand organe du corps ?", answers: ["Foie", "Intestin", "Peau", "Cerveau"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1204, category: 'Biologie', categoryId: 'biologie', question: "Que transporte l'hémoglobine ?", answers: ["Nutriments", "Oxygène", "Hormones", "Anticorps"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1205, category: 'Biologie', categoryId: 'biologie', question: "Combien d'os dans le corps adulte ?", answers: ["186", "206", "226", "246"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1206, category: 'Biologie', categoryId: 'biologie', question: "Quel est le groupe sanguin universel donneur ?", answers: ["A", "B", "AB", "O"], correct: 3, difficulty: 'medium', points: 150 },
  { id: 1207, category: 'Biologie', categoryId: 'biologie', question: "Où se trouve l'ADN dans la cellule ?", answers: ["Cytoplasme", "Noyau", "Membrane", "Mitochondrie"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1208, category: 'Biologie', categoryId: 'biologie', question: "Quel organe produit l'insuline ?", answers: ["Foie", "Pancréas", "Thyroïde", "Reins"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1209, category: 'Biologie', categoryId: 'biologie', question: "Combien de litres de sang dans le corps humain ?", answers: ["3L", "5L", "7L", "9L"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1210, category: 'Biologie', categoryId: 'biologie', question: "Quel est le muscle le plus puissant du corps ?", answers: ["Biceps", "Quadriceps", "Cœur", "Mâchoire"], correct: 3, difficulty: 'hard', points: 200 },

  // ==================== ASTRONOMIE ====================
  { id: 1301, category: 'Astronomie', categoryId: 'astronomie', question: "Quelle est l'étoile la plus proche de la Terre ?", answers: ["Alpha Centauri", "Soleil", "Sirius", "Proxima"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1302, category: 'Astronomie', categoryId: 'astronomie', question: "Combien de planètes dans le système solaire ?", answers: ["7", "8", "9", "10"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1303, category: 'Astronomie', categoryId: 'astronomie', question: "Quelle planète a des anneaux ?", answers: ["Jupiter", "Saturne", "Uranus", "Toutes"], correct: 3, difficulty: 'hard', points: 200 },
  { id: 1304, category: 'Astronomie', categoryId: 'astronomie', question: "Qu'est-ce qu'une année-lumière ?", answers: ["Temps", "Distance", "Vitesse", "Masse"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1305, category: 'Astronomie', categoryId: 'astronomie', question: "Quelle est la plus grande planète ?", answers: ["Saturne", "Jupiter", "Neptune", "Uranus"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1306, category: 'Astronomie', categoryId: 'astronomie', question: "Qu'est-ce qu'un trou noir ?", answers: ["Étoile morte", "Zone de gravité extrême", "Planète sombre", "Nuage cosmique"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1307, category: 'Astronomie', categoryId: 'astronomie', question: "Combien de lunes a la Terre ?", answers: ["0", "1", "2", "3"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1308, category: 'Astronomie', categoryId: 'astronomie', question: "Quelle galaxie contient notre système solaire ?", answers: ["Andromède", "Voie Lactée", "Triangulum", "Sombrero"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1309, category: 'Astronomie', categoryId: 'astronomie', question: "Quelle planète est la plus chaude ?", answers: ["Mercure", "Vénus", "Mars", "Jupiter"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1310, category: 'Astronomie', categoryId: 'astronomie', question: "Qui a été le premier homme sur la Lune ?", answers: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], correct: 1, difficulty: 'easy', points: 100 },

  // ==================== ÉCONOMIE ====================
  { id: 1401, category: 'Économie', categoryId: 'economie', question: "Quelle est la monnaie de l'Europe ?", answers: ["Dollar", "Euro", "Livre", "Franc"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1402, category: 'Économie', categoryId: 'economie', question: "Que signifie PIB ?", answers: ["Produit Intérieur Brut", "Prix International Base", "Production Industrielle Brute", "Profit Interne Bancaire"], correct: 0, difficulty: 'medium', points: 150 },
  { id: 1403, category: 'Économie', categoryId: 'economie', question: "Quelle est la plus grande économie mondiale ?", answers: ["Chine", "USA", "Japon", "Allemagne"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1404, category: 'Économie', categoryId: 'economie', question: "Qu'est-ce que l'inflation ?", answers: ["Baisse des prix", "Hausse des prix", "Stabilité des prix", "Gel des prix"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1405, category: 'Économie', categoryId: 'economie', question: "Quelle entreprise vaut le plus cher ?", answers: ["Google", "Amazon", "Apple", "Microsoft"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 1406, category: 'Économie', categoryId: 'economie', question: "Qu'est-ce qu'une action en bourse ?", answers: ["Part d'entreprise", "Prêt bancaire", "Obligation", "Devise"], correct: 0, difficulty: 'easy', points: 100 },
  { id: 1407, category: 'Économie', categoryId: 'economie', question: "Quelle est la monnaie du Royaume-Uni ?", answers: ["Euro", "Dollar", "Livre Sterling", "Franc"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1408, category: 'Économie', categoryId: 'economie', question: "Qu'est-ce que le Bitcoin ?", answers: ["Monnaie physique", "Cryptomonnaie", "Action", "Obligation"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1409, category: 'Économie', categoryId: 'economie', question: "Qui dirige la Banque Centrale Européenne ?", answers: ["FMI", "BCE", "Fed", "BRI"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1410, category: 'Économie', categoryId: 'economie', question: "Qu'est-ce qu'une récession ?", answers: ["Croissance forte", "Déclin économique", "Stabilité", "Expansion"], correct: 1, difficulty: 'medium', points: 150 },

  // ==================== FOOTBALL ====================
  { id: 1501, category: 'Football', categoryId: 'football', question: "Qui a gagné le Ballon d'Or 2023 ?", answers: ["Mbappé", "Haaland", "Messi", "Bellingham"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1502, category: 'Football', categoryId: 'football', question: "Combien de joueurs dans une équipe ?", answers: ["9", "10", "11", "12"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1503, category: 'Football', categoryId: 'football', question: "Quel club a le plus de Ligues des Champions ?", answers: ["AC Milan", "Barcelona", "Real Madrid", "Bayern"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1504, category: 'Football', categoryId: 'football', question: "Qui est le meilleur buteur de l'histoire ?", answers: ["Pelé", "Ronaldo", "Messi", "Romario"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1505, category: 'Football', categoryId: 'football', question: "Quel pays a gagné la CAN 2024 ?", answers: ["Nigeria", "Côte d'Ivoire", "Sénégal", "Cameroun"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1506, category: 'Football', categoryId: 'football', question: "Combien dure un match de football ?", answers: ["80 min", "90 min", "100 min", "120 min"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1507, category: 'Football', categoryId: 'football', question: "Quel joueur congolais joue à l'Inter Milan ?", answers: ["Bakambu", "Mbemba", "Lukaku", "Bolasie"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 1508, category: 'Football', categoryId: 'football', question: "Quel club est surnommé les 'Reds' ?", answers: ["Man United", "Liverpool", "Arsenal", "Bayern"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1509, category: 'Football', categoryId: 'football', question: "Qui a marqué le plus de buts en Coupe du Monde ?", answers: ["Ronaldo", "Klose", "Pelé", "Mbappé"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1510, category: 'Football', categoryId: 'football', question: "Quel pays organise la Coupe du Monde 2026 ?", answers: ["Qatar", "USA/Canada/Mexique", "Arabie Saoudite", "Maroc"], correct: 1, difficulty: 'medium', points: 150 },

  // ==================== BASKETBALL ====================
  { id: 1601, category: 'Basketball', categoryId: 'basketball', question: "Combien de joueurs sur le terrain par équipe ?", answers: ["4", "5", "6", "7"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1602, category: 'Basketball', categoryId: 'basketball', question: "Qui est considéré comme le GOAT du basket ?", answers: ["Kobe", "LeBron", "Jordan", "Kareem"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1603, category: 'Basketball', categoryId: 'basketball', question: "Combien vaut un tir à 3 points ?", answers: ["2", "3", "4", "5"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1604, category: 'Basketball', categoryId: 'basketball', question: "Quelle équipe a le plus de titres NBA ?", answers: ["Lakers", "Celtics", "Bulls", "Warriors"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1605, category: 'Basketball', categoryId: 'basketball', question: "Qui a le plus de points en carrière NBA ?", answers: ["Jordan", "Kareem", "LeBron", "Kobe"], correct: 2, difficulty: 'medium', points: 150 },
  { id: 1606, category: 'Basketball', categoryId: 'basketball', question: "Combien de temps dure un quart-temps NBA ?", answers: ["10 min", "12 min", "15 min", "20 min"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1607, category: 'Basketball', categoryId: 'basketball', question: "Quel joueur est surnommé 'King James' ?", answers: ["James Harden", "LeBron James", "James Worthy", "Chris Paul"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1608, category: 'Basketball', categoryId: 'basketball', question: "Dans quelle ville jouent les Lakers ?", answers: ["New York", "Chicago", "Los Angeles", "Miami"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1609, category: 'Basketball', categoryId: 'basketball', question: "Qui a inventé le basketball ?", answers: ["Michael Jordan", "James Naismith", "Wilt Chamberlain", "Bill Russell"], correct: 1, difficulty: 'hard', points: 200 },
  { id: 1610, category: 'Basketball', categoryId: 'basketball', question: "Combien de fautes pour être exclu en NBA ?", answers: ["4", "5", "6", "7"], correct: 2, difficulty: 'medium', points: 150 },

  // ==================== THÉÂTRE ====================
  { id: 1701, category: 'Théâtre', categoryId: 'theatre', question: "Qui a écrit Hamlet ?", answers: ["Molière", "Shakespeare", "Racine", "Corneille"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1702, category: 'Théâtre', categoryId: 'theatre', question: "Quel dramaturge français a écrit Tartuffe ?", answers: ["Racine", "Corneille", "Molière", "Beaumarchais"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1703, category: 'Théâtre', categoryId: 'theatre', question: "Qu'est-ce qu'un monologue ?", answers: ["Dialogue à deux", "Discours seul", "Chant", "Danse"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1704, category: 'Théâtre', categoryId: 'theatre', question: "Où se trouve Broadway ?", answers: ["Londres", "Paris", "New York", "Los Angeles"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1705, category: 'Théâtre', categoryId: 'theatre', question: "Quel est le théâtre national français ?", answers: ["Odéon", "Comédie-Française", "Châtelet", "Mogador"], correct: 1, difficulty: 'medium', points: 150 },

  // ==================== DIVERTISSEMENT ====================
  { id: 1801, category: 'Divertissement', categoryId: 'divertissement', question: "Quel est le parc Disney le plus visité ?", answers: ["Disneyland Paris", "Magic Kingdom", "Tokyo Disney", "Shanghai Disney"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1802, category: 'Divertissement', categoryId: 'divertissement', question: "Qui présente 'Qui veut gagner des millions' en France ?", answers: ["Nagui", "Jean-Pierre Foucault", "Laurent Ruquier", "Cyril Hanouna"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1803, category: 'Divertissement', categoryId: 'divertissement', question: "Quel jeu de société utilise des propriétés ?", answers: ["Scrabble", "Monopoly", "Risk", "Cluedo"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1804, category: 'Divertissement', categoryId: 'divertissement', question: "Combien de cases sur un échiquier ?", answers: ["36", "49", "64", "81"], correct: 2, difficulty: 'easy', points: 100 },
  { id: 1805, category: 'Divertissement', categoryId: 'divertissement', question: "Quel cirque est le plus célèbre au monde ?", answers: ["Cirque Pinder", "Cirque du Soleil", "Barnum", "Cirque Gruss"], correct: 1, difficulty: 'easy', points: 100 },

  // ==================== ANIMAUX ====================
  { id: 1901, category: 'Animaux', categoryId: 'animaux', question: "Quel est le plus grand animal terrestre ?", answers: ["Girafe", "Éléphant", "Rhinocéros", "Hippopotame"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1902, category: 'Animaux', categoryId: 'animaux', question: "Quel animal est le roi de la jungle ?", answers: ["Tigre", "Lion", "Léopard", "Guépard"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1903, category: 'Animaux', categoryId: 'animaux', question: "Combien de pattes a une araignée ?", answers: ["6", "8", "10", "12"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1904, category: 'Animaux', categoryId: 'animaux', question: "Quel animal produit du miel ?", answers: ["Guêpe", "Abeille", "Bourdon", "Frelon"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1905, category: 'Animaux', categoryId: 'animaux', question: "Quel est l'animal le plus rapide ?", answers: ["Lion", "Guépard", "Antilope", "Lévrier"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1906, category: 'Animaux', categoryId: 'animaux', question: "Quel animal est l'emblème de la RDC ?", answers: ["Lion", "Okapi", "Gorille", "Éléphant"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1907, category: 'Animaux', categoryId: 'animaux', question: "Combien de cœurs a une pieuvre ?", answers: ["1", "2", "3", "4"], correct: 2, difficulty: 'hard', points: 200 },
  { id: 1908, category: 'Animaux', categoryId: 'animaux', question: "Quel mammifère peut voler ?", answers: ["Écureuil volant", "Chauve-souris", "Polatouche", "Colugo"], correct: 1, difficulty: 'easy', points: 100 },
  { id: 1909, category: 'Animaux', categoryId: 'animaux', question: "Quel est le plus grand poisson ?", answers: ["Baleine", "Requin-baleine", "Raie manta", "Thon"], correct: 1, difficulty: 'medium', points: 150 },
  { id: 1910, category: 'Animaux', categoryId: 'animaux', question: "Quel animal change de couleur ?", answers: ["Gecko", "Caméléon", "Iguane", "Lézard"], correct: 1, difficulty: 'easy', points: 100 },
];

// Fonction pour obtenir des questions par catégorie
export const getQuestionsByCategory = (categoryId: string, count: number = 10): Question[] => {
  const categoryQuestions = QUESTIONS_DB.filter(q => q.categoryId === categoryId);
  const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Fonction pour obtenir des questions aléatoires
export const getRandomQuestions = (count: number = 10): Question[] => {
  const shuffled = [...QUESTIONS_DB].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Fonction pour obtenir des questions par difficulté
export const getQuestionsByDifficulty = (difficulty: Question['difficulty'], count: number = 10): Question[] => {
  const filtered = QUESTIONS_DB.filter(q => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Statistiques des questions
export const getQuestionsStats = () => {
  const categories: Record<string, number> = {};
  QUESTIONS_DB.forEach(q => {
    categories[q.category] = (categories[q.category] || 0) + 1;
  });
  return {
    total: QUESTIONS_DB.length,
    byCategory: categories
  };
};
