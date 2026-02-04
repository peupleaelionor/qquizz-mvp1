import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Users, 
  MessageCircle, 
  Zap, 
  Star, 
  Crown,
  Target,
  Flame,
  ChevronRight,
  Play,
  Award,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Catégories avec les vrais assets
const categories = [
  { id: 'sport', name: 'Sport', image: '/images/categories/Cat_Sport.png', color: 'from-orange-500 to-red-600' },
  { id: 'science', name: 'Science', image: '/images/categories/Cat_Science.png', color: 'from-blue-500 to-cyan-500' },
  { id: 'culture', name: 'Culture', image: '/images/categories/Cat_Culture.png', color: 'from-purple-500 to-pink-500' },
  { id: 'tech', name: 'Tech', image: '/images/categories/Cat_Tech.png', color: 'from-green-500 to-emerald-500' },
  { id: 'cinema', name: 'Cinéma', image: '/images/categories/Cat_Cinema.png', color: 'from-yellow-500 to-orange-500' },
  { id: 'musique', name: 'Musique', image: '/images/categories/Cat_Musique.png', color: 'from-pink-500 to-rose-500' },
  { id: 'geographie', name: 'Géographie', image: '/images/categories/Cat_Geographie.png', color: 'from-teal-500 to-cyan-500' },
  { id: 'histoire', name: 'Histoire', image: '/images/categories/Cat_Histoire.png', color: 'from-amber-600 to-yellow-500' },
  { id: 'gastronomie', name: 'Gastronomie', image: '/images/categories/Cat_Gastronomie.png', color: 'from-red-500 to-orange-500' },
  { id: 'art', name: 'Art', image: '/images/categories/Cat_Art.png', color: 'from-violet-500 to-purple-500' },
  { id: 'jeux_video', name: 'Jeux Vidéo', image: '/images/categories/Cat_Jeux_Video.png', color: 'from-indigo-500 to-blue-500' },
  { id: 'series_tv', name: 'Séries TV', image: '/images/categories/Cat_Series_TV.png', color: 'from-rose-500 to-pink-500' },
];

// Badges de ligues avec les vrais assets
const leagues = [
  { name: 'Bronze', image: '/images/badges/Badge_Bronze.png' },
  { name: 'Argent', image: '/images/badges/Badge_Argent.png' },
  { name: 'Or', image: '/images/badges/Badge_Or.png' },
  { name: 'Platine', image: '/images/badges/Badge_Platine.png' },
  { name: 'Diamant', image: '/images/badges/Badge_Diamant.png' },
  { name: 'Légende', image: '/images/badges/Badge_Legende.png' },
];

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 py-3" 
        : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/images/logo/Icone_App_Dark.png" 
            alt="QQUIZ PRODIGY" 
            className="w-12 h-12 rounded-xl object-cover shadow-lg shadow-purple-500/30"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
            QQUIZ PRODIGY
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/leaderboard" className="text-white/70 hover:text-cyan-400 transition-colors font-medium">
            Classement
          </Link>
          <Link to="/friends" className="text-white/70 hover:text-cyan-400 transition-colors font-medium">
            Amis
          </Link>
          <Link to="/chat" className="text-white/70 hover:text-cyan-400 transition-colors font-medium">
            Messages
          </Link>
          <Link to="/play">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-6 rounded-full shadow-lg shadow-cyan-500/25">
              Jouer
            </Button>
          </Link>
        </div>

        <Link to="/profile" className="md:hidden">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <span className="font-bold">U</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

// Hero Section avec catégories style QuizUp
const Hero = () => {
  const navigate = useNavigate();
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowMatchmaking(true);
    setTimeout(() => {
      navigate('/play', { state: { category: categoryId } });
    }, 2000);
  };

  return (
    <>
      <section className="relative min-h-screen pt-24 pb-12 overflow-hidden bg-black">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-12"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-500/30 mb-6 backdrop-blur-sm">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-cyan-400">Saison 1 - En ligne</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
              CHOISIS TA
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                CATÉGORIE
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Affronte des joueurs du monde entier en temps réel !
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="flex justify-center gap-8 mb-12">
              {[
                { value: "50K+", label: "Joueurs", icon: Users },
                { value: "1M+", label: "Parties", icon: Target },
                { value: "20+", label: "Catégories", icon: Star }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Grille de Catégories - Style QuizUp */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                variants={scaleIn}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/20"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Effet de glow au hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${category.color}`} />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal Matchmaking */}
      <AnimatePresence>
        {showMatchmaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-cyan-500 border-l-transparent animate-spin" />
                <img 
                  src="/images/logo/Logo_Principal_Neon.png" 
                  alt="Loading"
                  className="absolute inset-4 w-24 h-24 object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                Recherche d'adversaire...
              </h3>
              <p className="text-gray-400 text-lg">
                Catégorie: <span className="text-violet-400 font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Section Ligues avec les vrais badges
const LeaguesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ligues <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Compétitives</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/60 max-w-xl mx-auto">
            Grimpe dans les ligues et débloque des récompenses exclusives
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {leagues.map((league, index) => (
            <motion.div
              key={league.name}
              variants={scaleIn}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={league.image} 
                  alt={league.name}
                  className="w-20 h-20 md:w-28 md:h-28 object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              </div>
              <span className="text-gray-400 text-sm md:text-base mt-3 group-hover:text-white transition-colors">
                {league.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: Trophy,
      title: "Duels 1v1",
      description: "Affronte tes amis ou des joueurs aléatoires en temps réel",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: MessageCircle,
      title: "Chat Global",
      description: "Discute avec la communauté et partage tes victoires",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Système d'Amis",
      description: "Ajoute des amis et crée ta team de champions",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Crown,
      title: "Classement",
      description: "Grimpe dans le leaderboard mondial et deviens n°1",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Leaderboard Preview
const LeaderboardPreview = () => {
  const topPlayers = [
    { rank: 1, name: "ProdigyMaster", score: 125420, avatar: "PM", country: "🇨🇩", league: "/images/badges/Badge_Legende.png" },
    { rank: 2, name: "QuizKing243", score: 98750, avatar: "QK", country: "🇨🇩", league: "/images/badges/Badge_Diamant.png" },
    { rank: 3, name: "BrainStorm", score: 87200, avatar: "BS", country: "🇫🇷", league: "/images/badges/Badge_Diamant.png" },
    { rank: 4, name: "QuizNinja", score: 65800, avatar: "QN", country: "🇧🇪", league: "/images/badges/Badge_Platine.png" },
    { rank: 5, name: "MindReader", score: 54450, avatar: "MR", country: "🇸🇳", league: "/images/badges/Badge_Platine.png" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Classement <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">Mondial</span>
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Affronte les meilleurs joueurs et grimpe dans le classement pour gagner des récompenses exclusives.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/leaderboard">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-8 rounded-full">
                  <Award className="w-5 h-5 mr-2" />
                  Voir le Classement
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-white/60">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Temps réel</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-0">
                {topPlayers.map((player, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                      i === 0 ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      i === 0 ? "bg-yellow-500 text-black" :
                      i === 1 ? "bg-gray-400 text-black" :
                      i === 2 ? "bg-orange-600 text-white" :
                      "bg-white/10 text-white"
                    }`}>
                      {player.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-sm">
                      {player.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{player.name}</span>
                        <span>{player.country}</span>
                      </div>
                      <div className="text-sm text-white/50">{player.score.toLocaleString()} points</div>
                    </div>
                    <img src={player.league} alt="League" className="w-8 h-8 object-contain" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600" />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-white mb-6">
            Prêt à devenir un <span className="text-cyan-300">Prodigy</span> ?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Rejoins des milliers de joueurs et commence ton ascension vers le sommet !
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/play">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-bold px-12 h-14 text-lg rounded-full shadow-2xl">
                <Zap className="w-6 h-6 mr-2" />
                Jouer Maintenant
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-10 bg-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo/Icone_App_Dark.png" 
              alt="QQUIZ" 
              className="w-10 h-10 rounded-lg opacity-80"
            />
            <span className="text-lg font-bold text-white/80">QQUIZ PRODIGY</span>
          </div>
          <div className="flex items-center gap-8 text-white/50 text-sm">
            <a href="#" className="hover:text-cyan-400 transition-colors">Conditions</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="text-white/30 text-sm">
            2026 QQUIZ PRODIGY
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <LeaguesSection />
      <Features />
      <LeaderboardPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
