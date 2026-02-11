/**
 * QQUIZ PRODIGY - Asset Helper
 * Gère les chemins d'assets pour GitHub Pages et développement local
 */

// Détecte automatiquement la base URL
const BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * Retourne le chemin complet d'un asset
 * @param path - Chemin relatif de l'asset (ex: '/images/logo/Logo_Principal_Neon.png')
 * @returns Chemin complet avec la base URL
 */
export function getAssetPath(path: string): string {
  // Si le chemin commence par http ou https, le retourner tel quel
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Supprimer le slash initial si présent pour éviter les doubles slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Combiner avec la base URL
  const basePath = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
  return basePath + cleanPath;
}

/**
 * Chemins des assets principaux
 */
export const ASSETS = {
  logo: {
    icon: getAssetPath('/images/logo/Logo_Principal_Neon.png'),
    main: getAssetPath('/images/logo/Logo_Principal_Neon.png'),
  },
  badges: {
    bronze: getAssetPath('/images/badges/Badge_Bronze.png'),
    argent: getAssetPath('/images/badges/Badge_Argent.png'),
    or: getAssetPath('/images/badges/Badge_Or.png'),
    platine: getAssetPath('/images/badges/Badge_Platine.png'),
    diamant: getAssetPath('/images/badges/Badge_Diamant.png'),
    legende: getAssetPath('/images/badges/Badge_Legende.png'),
  },
  categories: {
    rap: getAssetPath('/images/categories/Cat_Rap.png'),
    tiktok: getAssetPath('/images/categories/Cat_TikTok.png'),
    kpop: getAssetPath('/images/categories/Cat_Kpop.png'),
    footballafricain: getAssetPath('/images/categories/Cat_FootballAfricain.png'),
    gamingpro: getAssetPath('/images/categories/Cat_GamingPro.png'),
    youtube: getAssetPath('/images/categories/Cat_Youtube.png'),
    mode: getAssetPath('/images/categories/Cat_Mode.png'),
    afrique: getAssetPath('/images/categories/Cat_Afrique.png'),
    afrobeats: getAssetPath('/images/categories/Cat_Afrobeats.png'),
    nba: getAssetPath('/images/categories/Cat_NBA.png'),
    manga: getAssetPath('/images/categories/Cat_Manga.png'),
    marvel: getAssetPath('/images/categories/Cat_Marvel.png'),
    netflix: getAssetPath('/images/categories/Cat_Netflix.png'),
    celebrites: getAssetPath('/images/categories/Cat_Celebrites.png'),
    crypto: getAssetPath('/images/categories/Cat_Crypto.png'),
    sport: getAssetPath('/images/categories/Cat_Sport.png'),
    science: getAssetPath('/images/categories/Cat_Science.png'),
    culture: getAssetPath('/images/categories/Cat_Culture.png'),
    tech: getAssetPath('/images/categories/Cat_Tech.png'),
    cinema: getAssetPath('/images/categories/Cat_Cinema.png'),
    musique: getAssetPath('/images/categories/Cat_Musique.png'),
    geographie: getAssetPath('/images/categories/Cat_Geographie.png'),
    histoire: getAssetPath('/images/categories/Cat_Histoire.png'),
    football: getAssetPath('/images/categories/Cat_Football.png'),
    jeux_video: getAssetPath('/images/categories/Cat_Jeux_Video.png'),
  },
  backgrounds: {
    rap: getAssetPath('/images/questions/bg_rap.png'),
    football: getAssetPath('/images/questions/bg_football.png'),
    manga: getAssetPath('/images/questions/bg_manga.png'),
    netflix: getAssetPath('/images/questions/bg_netflix.png'),
    crypto: getAssetPath('/images/questions/bg_crypto.png'),
    kpop: getAssetPath('/images/questions/bg_kpop.png'),
    afrobeats: getAssetPath('/images/questions/bg_afrobeats.png'),
    nba: getAssetPath('/images/questions/bg_nba.png'),
    marvel: getAssetPath('/images/questions/bg_marvel.png'),
    gaming: getAssetPath('/images/questions/bg_gaming.png'),
    tiktok: getAssetPath('/images/questions/bg_tiktok.png'),
    afrique: getAssetPath('/images/questions/bg_afrique.png'),
    youtube: getAssetPath('/images/questions/bg_youtube.png'),
    mode: getAssetPath('/images/questions/bg_mode.png'),
    celebrites: getAssetPath('/images/questions/bg_celebrites.png'),
  },
};
