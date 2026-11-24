import type { Project } from '../data/projects';

/**
 * QWERTY Keyboard Adjacency Map
 * Used to give a preference bonus to typos caused by hitting an adjacent key (e.g. 'u' next to 'i').
 */
const QWERTY_ADJACENT: Record<string, string[]> = {
  q: ['w', 'a', 's'],
  w: ['q', 'e', 'a', 's', 'd'],
  e: ['w', 'r', 's', 'd', 'f'],
  r: ['e', 't', 'd', 'f', 'g'],
  t: ['r', 'y', 'f', 'g', 'h'],
  y: ['t', 'u', 'g', 'h', 'j'],
  u: ['y', 'i', 'h', 'j', 'k'], // 'u' adjacent to 'i'
  i: ['u', 'o', 'j', 'k', 'l'], // 'i' adjacent to 'u' and 'o'
  o: ['i', 'p', 'k', 'l'],
  p: ['o', 'l'],
  a: ['q', 'w', 's', 'z'],
  s: ['w', 'e', 'a', 'd', 'z', 'x'],
  d: ['e', 'r', 's', 'f', 'x', 'c'],
  f: ['r', 't', 'd', 'g', 'c', 'v'],
  g: ['t', 'y', 'f', 'h', 'v', 'b'],
  h: ['y', 'u', 'g', 'j', 'b', 'n'],
  j: ['u', 'i', 'h', 'k', 'n', 'm'],
  k: ['i', 'o', 'j', 'l', 'm'],
  l: ['o', 'p', 'k'],
  z: ['a', 's', 'x'],
  x: ['z', 's', 'd', 'c'],
  c: ['x', 'd', 'f', 'v'],
  v: ['c', 'f', 'g', 'b'],
  b: ['v', 'g', 'h', 'n'],
  n: ['b', 'h', 'j', 'm'],
  m: ['n', 'j', 'k'],
  '0': ['9', 'o', 'p'],
  '1': ['2', 'q'],
  '2': ['1', '3', 'q', 'w'],
  '3': ['2', '4', 'w', 'e'],
  '4': ['3', '5', 'e', 'r'],
  '5': ['4', '6', 'r', 't'],
  '6': ['5', '7', 't', 'y'],
  '7': ['6', '8', 'y', 'u'],
  '8': ['7', '9', 'u', 'i'],
  '9': ['8', '0', 'i', 'o'],
};

/**
 * Computes Damerau-Levenshtein distance between two strings,
 * supporting insertions, deletions, substitutions, and adjacent character transpositions.
 */
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        min = Math.min(min, matrix[i - 2][j - 2] + cost);
      }

      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

/**
 * Checks if a single substitution between two characters is an adjacent QWERTY key.
 */
export function isKeyboardAdjacent(charA: string, charB: string): boolean {
  const a = charA.toLowerCase();
  const b = charB.toLowerCase();
  return Boolean(QWERTY_ADJACENT[a]?.includes(b));
}

/**
 * Tokenize a text string into clean alphanumeric words.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s,/_]+/)
    .filter((w) => w.length > 0);
}

export interface VocabularyWord {
  word: string;
  weight: number;
  count: number;
}

/**
 * Curated domain dictionary seed terms common in design, 3D CGI, and web engineering.
 */
const DOMAIN_SEED_WORDS: Array<{ word: string; weight: number }> = [
  { word: 'iot', weight: 15 },
  { word: 'project', weight: 15 },
  { word: 'projects', weight: 15 },
  { word: 'product', weight: 14 },
  { word: 'design', weight: 15 },
  { word: 'portfolio', weight: 14 },
  { word: 'study', weight: 12 },
  { word: 'website', weight: 12 },
  { word: 'platform', weight: 12 },
  { word: 'system', weight: 12 },
  { word: 'app', weight: 12 },
  { word: 'vray', weight: 15 },
  { word: 'maya', weight: 15 },
  { word: 'blender', weight: 15 },
  { word: 'zbrush', weight: 15 },
  { word: 'figma', weight: 15 },
  { word: 'substance', weight: 15 },
  { word: 'painter', weight: 12 },
  { word: 'cinema4d', weight: 12 },
  { word: '3dsmax', weight: 15 },
  { word: 'react', weight: 12 },
  { word: 'motion', weight: 12 },
  { word: 'animation', weight: 14 },
  { word: 'render', weight: 12 },
  { word: 'rendering', weight: 12 },
  { word: 'lighting', weight: 12 },
  { word: 'sculpting', weight: 12 },
  { word: 'sculpt', weight: 12 },
  { word: 'monitor', weight: 14 },
  { word: 'retro', weight: 12 },
  { word: 'stage', weight: 12 },
  { word: 'shoe', weight: 14 },
  { word: 'axe', weight: 14 },
  { word: 'shark', weight: 14 },
  { word: 'token', weight: 14 },
  { word: 'sustainability', weight: 14 },
  { word: 'fabric', weight: 12 },
  { word: 'village', weight: 12 },
  { word: 'heartbeat', weight: 12 },
  { word: 'gadget', weight: 14 },
  { word: 'mct', weight: 12 },
  { word: 'walton', weight: 15 },
  { word: 'evergreen', weight: 14 },
  { word: 'eid', weight: 12 },
  { word: 'massfx', weight: 14 },
  { word: 'physics', weight: 12 },
  { word: 'simulation', weight: 12 },
  { word: 'typography', weight: 12 },
  { word: 'depth', weight: 12 },
  { word: 'bokeh', weight: 12 },
  { word: 'fog', weight: 12 },
  { word: 'gobo', weight: 12 },
  { word: 'telemetry', weight: 12 },
  { word: 'hardware', weight: 10 },
  { word: 'smart', weight: 10 },
  { word: 'carbon', weight: 12 },
  { word: 'tracker', weight: 12 },
  { word: 'commercial', weight: 10 },
  { word: 'ecommerce', weight: 10 },
  { word: 'environment', weight: 10 },
  { word: 'chess', weight: 14 },
];

/**
 * Builds a search vocabulary from projects and domain keywords with frequency & weights.
 */
export function buildCorpusVocabulary(projects: Project[]): Map<string, VocabularyWord> {
  const map = new Map<string, VocabularyWord>();

  const addWord = (word: string, weight: number) => {
    const w = word.toLowerCase().trim();
    if (!w || w.length < 2) return;
    const existing = map.get(w);
    if (existing) {
      existing.count += 1;
      existing.weight = Math.max(existing.weight, weight);
    } else {
      map.set(w, { word: w, weight, count: 1 });
    }
  };

  // Seed domain terms
  for (const item of DOMAIN_SEED_WORDS) {
    addWord(item.word, item.weight);
  }

  // Extract from projects
  for (const p of projects) {
    tokenize(p.title).forEach((w) => addWord(w, 10));
    if (p.shortTitle) tokenize(p.shortTitle).forEach((w) => addWord(w, 9));
    if (p.category) tokenize(p.category).forEach((w) => addWord(w, 8));
    if (p.tags) p.tags.forEach((tag) => tokenize(tag).forEach((w) => addWord(w, 8)));
    if (p.role) tokenize(p.role).forEach((w) => addWord(w, 6));
    if (p.summary) tokenize(p.summary).forEach((w) => addWord(w, 5));
    if (p.description) {
      const stripped = p.description.replace(/<[^>]+>/g, ' ');
      tokenize(stripped).forEach((w) => addWord(w, 2));
    }
  }

  return map;
}

/**
 * Finds the closest vocabulary word for a misspelled search word.
 * Returns the corrected word if a high-confidence match is found; otherwise returns original word.
 */
export function correctSingleWord(
  inputWord: string,
  vocabulary: Map<string, VocabularyWord>
): { corrected: string; wasCorrected: boolean; distance: number } {
  const raw = inputWord.toLowerCase().trim();
  if (raw.length < 2) {
    return { corrected: raw, wasCorrected: false, distance: 0 };
  }

  // If already an exact match in vocabulary with notable presence
  if (vocabulary.has(raw)) {
    return { corrected: raw, wasCorrected: false, distance: 0 };
  }

  // Maximum allowed distance based on word length
  const maxDistance = raw.length <= 4 ? 1 : raw.length <= 7 ? 2 : 3;

  let bestMatch: VocabularyWord | null = null;
  let bestScore = -Infinity;
  let bestDist = Infinity;

  for (const cand of vocabulary.values()) {
    const candWord = cand.word;

    // Fast length filter
    if (Math.abs(candWord.length - raw.length) > maxDistance) {
      continue;
    }

    const dist = damerauLevenshtein(raw, candWord);
    if (dist <= maxDistance) {
      // Score calculation
      // 1. Lower distance gives huge points
      let score = (maxDistance - dist + 1) * 30;

      // 2. Length parity bonus
      if (raw.length === candWord.length) score += 5;

      // 3. First character match bonus
      if (raw[0] === candWord[0]) score += 10;

      // 4. Keyboard adjacency bonus if substitution happened on adjacent key (e.g. u -> i)
      if (dist === 1 && raw.length === candWord.length) {
        for (let i = 0; i < raw.length; i++) {
          if (raw[i] !== candWord[i] && isKeyboardAdjacent(raw[i], candWord[i])) {
            score += 15; // Strong boost for adjacent key slip!
            break;
          }
        }
      }

      // 5. Corpus frequency & priority weight
      score += Math.min(20, cand.weight + Math.log2(cand.count + 1) * 2);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = cand;
        bestDist = dist;
      }
    }
  }

  if (bestMatch && bestDist <= maxDistance) {
    return { corrected: bestMatch.word, wasCorrected: true, distance: bestDist };
  }

  return { corrected: raw, wasCorrected: false, distance: 0 };
}

export interface QueryCorrectionResult {
  rawQuery: string;
  correctedQuery: string;
  hasCorrection: boolean;
  correctionDetails: Array<{ original: string; corrected: string }>;
}

/**
 * Corrects multi-word search queries token by token.
 */
export function correctSearchQuery(
  query: string,
  vocabulary: Map<string, VocabularyWord>
): QueryCorrectionResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      rawQuery: '',
      correctedQuery: '',
      hasCorrection: false,
      correctionDetails: [],
    };
  }

  const tokens = trimmed.split(/\s+/);
  const details: Array<{ original: string; corrected: string }> = [];
  let hasCorrection = false;

  const correctedTokens = tokens.map((token) => {
    // Keep alphanumeric part for spell checking
    const match = token.match(/^([^\w]*)([\w-]+)([^\w]*)$/);
    if (!match) return token;

    const [, prefix, word, suffix] = match;
    const { corrected, wasCorrected } = correctSingleWord(word, vocabulary);

    if (wasCorrected) {
      hasCorrection = true;
      details.push({ original: word, corrected });
      return `${prefix}${corrected}${suffix}`;
    }

    return token;
  });

  const correctedQuery = correctedTokens.join(' ');

  return {
    rawQuery: trimmed,
    correctedQuery,
    hasCorrection,
    correctionDetails: details,
  };
}

/**
 * Checks whether a project matches a search query using exact and typo-tolerant matching.
 */
export function matchesProject(
  project: Project,
  queryWords: string[],
  categoryFilter: string
): { matches: boolean; score: number } {
  // Category match check
  if (categoryFilter !== 'All' && project.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
    return { matches: false, score: 0 };
  }

  if (queryWords.length === 0) {
    return { matches: true, score: 1 };
  }

  // Pre-tokenize searchable text fields
  const titleTokens = tokenize(project.title);
  const shortTitleTokens = project.shortTitle ? tokenize(project.shortTitle) : [];
  const tagTokens = project.tags ? project.tags.flatMap(tokenize) : [];
  const summaryTokens = tokenize(project.summary || '');
  const categoryTokens = tokenize(project.category || '');
  const fullSearchString = [
    project.title,
    project.shortTitle || '',
    project.category || '',
    (project.tags || []).join(' '),
    project.summary || '',
  ]
    .join(' ')
    .toLowerCase();

  let totalScore = 0;
  let allTokensMatched = true;

  for (const qWord of queryWords) {
    const qw = qWord.toLowerCase();
    let wordMatched = false;
    let wordScore = 0;

    // 1. Direct exact substring match in combined text
    if (fullSearchString.includes(qw)) {
      wordMatched = true;
      wordScore += 20;

      // Higher weight if matched in title or tags
      if (titleTokens.some((t) => t === qw || t.startsWith(qw))) {
        wordScore += 50;
      } else if (tagTokens.some((t) => t === qw)) {
        wordScore += 40;
      } else if (shortTitleTokens.some((t) => t === qw)) {
        wordScore += 45;
      } else if (categoryTokens.some((t) => t === qw)) {
        wordScore += 30;
      }
    } else {
      // 2. Fuzzy match against project tokens
      const allProjectTokens = [
        ...titleTokens,
        ...shortTitleTokens,
        ...tagTokens,
        ...categoryTokens,
        ...summaryTokens,
      ];

      const maxDist = qw.length <= 4 ? 1 : qw.length <= 7 ? 2 : 3;

      for (const pToken of allProjectTokens) {
        if (Math.abs(pToken.length - qw.length) > maxDist) continue;
        const dist = damerauLevenshtein(qw, pToken);
        if (dist <= maxDist) {
          wordMatched = true;
          const matchScore = (maxDist - dist + 1) * 15;
          if (matchScore > wordScore) {
            wordScore = matchScore;
          }
        }
      }
    }

    if (!wordMatched) {
      allTokensMatched = false;
      break;
    }

    totalScore += wordScore;
  }

  return { matches: allTokensMatched, score: totalScore };
}
