export interface CircuitSpec {
  name: string;
  circuit: string;
  country: string;
  location: string;
  lengthKm: number;
  turns: number;
  drsZones: number;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  direction: 'Clockwise' | 'Anti-Clockwise' | 'Figure-Eight';
  firstGrandPrix: number;
  fullMapUrl: string;
  localMapUrl: string;
}

export const CIRCUIT_SPECS: Record<string, CircuitSpec> = {
  'Australia': {
    name: 'Australian Grand Prix',
    circuit: 'Albert Park Circuit',
    country: 'Australia',
    location: 'Melbourne',
    lengthKm: 5.278,
    turns: 14,
    drsZones: 4,
    lapRecord: { time: '1:19.813', driver: 'Charles Leclerc', year: 2024 },
    direction: 'Clockwise',
    firstGrandPrix: 1996,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png',
    localMapUrl: '/images/circuits/melbourne.svg'
  },
  'China': {
    name: 'Chinese Grand Prix',
    circuit: 'Shanghai International Circuit',
    country: 'China',
    location: 'Shanghai',
    lengthKm: 5.451,
    turns: 16,
    drsZones: 2,
    lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 },
    direction: 'Clockwise',
    firstGrandPrix: 2004,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png',
    localMapUrl: '/images/circuits/shanghai.svg'
  },
  'Japan': {
    name: 'Japanese Grand Prix',
    circuit: 'Suzuka International Racing Course',
    country: 'Japan',
    location: 'Suzuka',
    lengthKm: 5.807,
    turns: 18,
    drsZones: 1,
    lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 },
    direction: 'Figure-Eight',
    firstGrandPrix: 1987,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png',
    localMapUrl: '/images/circuits/suzuka.svg'
  },
  'Bahrain': {
    name: 'Bahrain Grand Prix',
    circuit: 'Bahrain International Circuit',
    country: 'Bahrain',
    location: 'Sakhir',
    lengthKm: 5.412,
    turns: 15,
    drsZones: 3,
    lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 },
    direction: 'Clockwise',
    firstGrandPrix: 2004,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png',
    localMapUrl: '/images/circuits/bahrain.svg'
  },
  'Saudi Arabia': {
    name: 'Saudi Arabian Grand Prix',
    circuit: 'Jeddah Corniche Circuit',
    country: 'Saudi Arabia',
    location: 'Jeddah',
    lengthKm: 6.174,
    turns: 27,
    drsZones: 3,
    lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2021,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png',
    localMapUrl: '/images/circuits/jeddah.svg'
  },
  'Miami': {
    name: 'Miami Grand Prix',
    circuit: 'Miami International Autodrome',
    country: 'USA',
    location: 'Miami',
    lengthKm: 5.412,
    turns: 19,
    drsZones: 3,
    lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2022,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png',
    localMapUrl: '/images/circuits/miami.svg'
  },
  'Emilia-Romagna': {
    name: 'Emilia Romagna Grand Prix',
    circuit: 'Autodromo Enzo e Dino Ferrari',
    country: 'Italy',
    location: 'Imola',
    lengthKm: 4.909,
    turns: 19,
    drsZones: 1,
    lapRecord: { time: '1:15.484', driver: 'Lewis Hamilton', year: 2020 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 1980,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png',
    localMapUrl: '/images/circuits/imola.svg'
  },
  'Monaco': {
    name: 'Monaco Grand Prix',
    circuit: 'Circuit de Monaco',
    country: 'Monaco',
    location: 'Monte Carlo',
    lengthKm: 3.337,
    turns: 19,
    drsZones: 1,
    lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 },
    direction: 'Clockwise',
    firstGrandPrix: 1950,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png',
    localMapUrl: '/images/circuits/monaco.svg'
  },
  'Spain': {
    name: 'Spanish Grand Prix',
    circuit: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    location: 'Barcelona',
    lengthKm: 4.657,
    turns: 14,
    drsZones: 2,
    lapRecord: { time: '1:16.666', driver: 'Max Verstappen', year: 2023 },
    direction: 'Clockwise',
    firstGrandPrix: 1991,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png',
    localMapUrl: '/images/circuits/catalunya.svg'
  },
  'Canada': {
    name: 'Canadian Grand Prix',
    circuit: 'Circuit Gilles-Villeneuve',
    country: 'Canada',
    location: 'Montreal',
    lengthKm: 4.361,
    turns: 14,
    drsZones: 2,
    lapRecord: { time: '1:13.078', driver: 'Valtteri Bottas', year: 2019 },
    direction: 'Clockwise',
    firstGrandPrix: 1978,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png',
    localMapUrl: '/images/circuits/montreal.svg'
  },
  'Austria': {
    name: 'Austrian Grand Prix',
    circuit: 'Red Bull Ring',
    country: 'Austria',
    location: 'Spielberg',
    lengthKm: 4.318,
    turns: 10,
    drsZones: 3,
    lapRecord: { time: '1:05.619', driver: 'Carlos Sainz', year: 2020 },
    direction: 'Clockwise',
    firstGrandPrix: 1970,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png',
    localMapUrl: '/images/circuits/spielberg.svg'
  },
  'Great Britain': {
    name: 'British Grand Prix',
    circuit: 'Silverstone Circuit',
    country: 'Great Britain',
    location: 'Silverstone',
    lengthKm: 5.891,
    turns: 18,
    drsZones: 2,
    lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 },
    direction: 'Clockwise',
    firstGrandPrix: 1950,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png',
    localMapUrl: '/images/circuits/silverstone.svg'
  },
  'Belgium': {
    name: 'Belgian Grand Prix',
    circuit: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    location: 'Spa-Francorchamps',
    lengthKm: 7.004,
    turns: 19,
    drsZones: 2,
    lapRecord: { time: '1:44.701', driver: 'Sergio Perez', year: 2024 },
    direction: 'Clockwise',
    firstGrandPrix: 1950,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png',
    localMapUrl: '/images/circuits/spa.svg'
  },
  'Hungary': {
    name: 'Hungarian Grand Prix',
    circuit: 'Hungaroring',
    country: 'Hungary',
    location: 'Budapest',
    lengthKm: 4.381,
    turns: 14,
    drsZones: 2,
    lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 },
    direction: 'Clockwise',
    firstGrandPrix: 1986,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit.png',
    localMapUrl: '/images/circuits/hungaroring.svg'
  },
  'Netherlands': {
    name: 'Dutch Grand Prix',
    circuit: 'Circuit Zandvoort',
    country: 'Netherlands',
    location: 'Zandvoort',
    lengthKm: 4.259,
    turns: 14,
    drsZones: 2,
    lapRecord: { time: '1:11.097', driver: 'Lewis Hamilton', year: 2021 },
    direction: 'Clockwise',
    firstGrandPrix: 1952,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit.png',
    localMapUrl: '/images/circuits/zandvoort.svg'
  },
  'Italy': {
    name: 'Italian Grand Prix',
    circuit: 'Autodromo Nazionale Monza',
    country: 'Italy',
    location: 'Monza',
    lengthKm: 5.793,
    turns: 11,
    drsZones: 2,
    lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 },
    direction: 'Clockwise',
    firstGrandPrix: 1950,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit.png',
    localMapUrl: '/images/circuits/monza.svg'
  },
  'Azerbaijan': {
    name: 'Azerbaijan Grand Prix',
    circuit: 'Baku City Circuit',
    country: 'Azerbaijan',
    location: 'Baku',
    lengthKm: 6.003,
    turns: 20,
    drsZones: 2,
    lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2016,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Baku_Circuit.png',
    localMapUrl: '/images/circuits/baku.svg'
  },
  'Singapore': {
    name: 'Singapore Grand Prix',
    circuit: 'Marina Bay Street Circuit',
    country: 'Singapore',
    location: 'Singapore',
    lengthKm: 4.940,
    turns: 19,
    drsZones: 4,
    lapRecord: { time: '1:34.486', driver: 'Daniel Ricciardo', year: 2024 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2008,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png',
    localMapUrl: '/images/circuits/singapore.svg'
  },
  'USA': {
    name: 'United States Grand Prix',
    circuit: 'Circuit of The Americas',
    country: 'USA',
    location: 'Austin',
    lengthKm: 5.513,
    turns: 20,
    drsZones: 2,
    lapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2012,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png',
    localMapUrl: '/images/circuits/austin.svg'
  },
  'Mexico': {
    name: 'Mexico City Grand Prix',
    circuit: 'Autodromo Hermanos Rodriguez',
    country: 'Mexico',
    location: 'Mexico City',
    lengthKm: 4.304,
    turns: 17,
    drsZones: 3,
    lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 },
    direction: 'Clockwise',
    firstGrandPrix: 1963,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png',
    localMapUrl: '/images/circuits/mexico.svg'
  },
  'Brazil': {
    name: 'Sao Paulo Grand Prix',
    circuit: 'Autodromo Jose Carlos Pace',
    country: 'Brazil',
    location: 'Sao Paulo',
    lengthKm: 4.309,
    turns: 15,
    drsZones: 2,
    lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 1973,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png',
    localMapUrl: '/images/circuits/interlagos.svg'
  },
  'Las Vegas': {
    name: 'Las Vegas Grand Prix',
    circuit: 'Las Vegas Strip Circuit',
    country: 'USA',
    location: 'Las Vegas',
    lengthKm: 6.201,
    turns: 17,
    drsZones: 2,
    lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2023 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2023,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png',
    localMapUrl: '/images/circuits/las-vegas.svg'
  },
  'Qatar': {
    name: 'Qatar Grand Prix',
    circuit: 'Lusail International Circuit',
    country: 'Qatar',
    location: 'Lusail',
    lengthKm: 5.419,
    turns: 16,
    drsZones: 1,
    lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 },
    direction: 'Clockwise',
    firstGrandPrix: 2021,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png',
    localMapUrl: '/images/circuits/losail.svg'
  },
  'Abu Dhabi': {
    name: 'Abu Dhabi Grand Prix',
    circuit: 'Yas Marina Circuit',
    country: 'Abu Dhabi',
    location: 'Yas Island',
    lengthKm: 5.281,
    turns: 16,
    drsZones: 2,
    lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 },
    direction: 'Anti-Clockwise',
    firstGrandPrix: 2009,
    fullMapUrl: 'https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png',
    localMapUrl: '/images/circuits/yas-marina.svg'
  }
};

export const getCircuitSpec = (locationOrCircuit: string): CircuitSpec | null => {
  const clean = locationOrCircuit.trim();
  if (!clean) return null;
  if (CIRCUIT_SPECS[clean]) return CIRCUIT_SPECS[clean];

  for (const [key, spec] of Object.entries(CIRCUIT_SPECS)) {
    if (
      clean.toLowerCase().includes(key.toLowerCase()) ||
      spec.circuit.toLowerCase().includes(clean.toLowerCase()) ||
      spec.location.toLowerCase().includes(clean.toLowerCase())
    ) {
      return spec;
    }
  }

  return null;
};
