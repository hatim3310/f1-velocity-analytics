/**
 * Use the portrait attached to this driver instead of guessing from a car
 * number, which can identify a different driver in another season.
 */
export const toUltraHdDriverUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  // Local asset overrides for new drivers
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('antonelli') || lowerUrl.includes('andant01') || lowerUrl.includes('kimant01')) {
    return '/images/drivers/antonelli.png';
  }
  if (lowerUrl.includes('lindblad') || lowerUrl.includes('arvlin01')) {
    return '/images/drivers/lindblad.png';
  }

  // If URL has .transform/1col/image.png or 2col, strip it to get the master uncompressed PNG
  if (url.includes('.transform/')) {
    return url.replace(/\.transform\/.*$/, '');
  }

  return url;
};

const LOCAL_PORTRAITS: Record<string, string> = {
  albon: 'alealb01.png', alonso: 'alonso.png', antonelli: 'antonelli.png',
  bearman: 'olibea01.png', bortoleto: 'gabbor01.png', bottas: 'BOTTAS.PNG',
  doohan: 'DOOHAN.png', gasly: 'piegas01.png', hadjar: 'isahad01.png',
  hamilton: 'hamilton.png', hulkenberg: 'nichul01.png', lawson: 'lialaw01.png',
  leclerc: 'leclerc.png', lindblad: 'lindblad.png', norris: 'norris.png',
  ocon: 'estoco01.png', perez: 'perez.png', piastri: 'piastri.png',
  ricciardo: 'ricciardo.png', russell: 'russell.png', sainz: 'sainz.png',
  stroll: 'stroll.png', tsunoda: 'yuktsu01.png', verstappen: 'verstappen.png'
};

const TEAM_ASSET_SLUGS: Record<string, string> = {
  'red bull racing': 'redbullracing', 'red bull': 'redbullracing',
  'mclaren': 'mclaren', 'mercedes': 'mercedes', 'ferrari': 'ferrari',
  'aston martin': 'astonmartin', 'alpine': 'alpine', 'williams': 'williams',
  'haas f1 team': 'haas', 'haas': 'haas', 'racing bulls': 'racingbulls',
  'rb': 'rb', 'kick sauber': 'kicksauber', 'sauber': 'kicksauber',
  'audi': 'audi', 'cadillac': 'cadillac'
};

export const getLocalDriverPortrait = (name?: string): string | undefined => {
  const surname = name?.trim().split(/\s+/).at(-1)?.toLowerCase();
  return surname && LOCAL_PORTRAITS[surname] ? `/images/drivers/${LOCAL_PORTRAITS[surname]}` : undefined;
};

export const getDriverPortrait = (name?: string, apiUrl?: string, year?: number, team?: string): string | undefined => {
  const driverCode = apiUrl?.match(/\/([a-z]{3,12}\d{2})\.png(?:\.|$)/i)?.[1]?.toLowerCase();
  const teamSlug = team ? TEAM_ASSET_SLUGS[team.trim().toLowerCase()] : undefined;
  if (driverCode && teamSlug && year && year >= 2024 && year <= 2026) {
    return `https://media.formula1.com/image/upload/c_fit,w_1200/q_auto/v1740000001/common/f1/${year}/${teamSlug}/${driverCode}/${year}${teamSlug}${driverCode}right.webp`;
  }
  if (apiUrl) return toUltraHdDriverUrl(apiUrl);
  return getLocalDriverPortrait(name);
};

/**
 * Converts any circuit map image URL into its uncompressed Master 16:9 Ultra HD layout.
 */
export const toUltraHdCircuitUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  return url.replace(/\.transform\/.*$/, '');
};
