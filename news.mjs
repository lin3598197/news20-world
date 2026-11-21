// news.mjs — the data for the FRIDAY 20 NOVEMBER 2026 sheet.
// Every number here is copied from facts20.md / facts20b.md. Nothing invented.

export const DAY = {
  long: 'FRIDAY 20 NOVEMBER 2026',
  short: 'NOV 20',
  dow: 'FRI',
  iso: '2026-11-20',
  kicker: 'THE WORLD ON ONE SHEET \u00b7 SEVEN REGIONS \u00b7 NO. 20',
  strap:
    'Everything here happened, or was first reported, on Friday 20 November 2026 \u2014 ' +
    'nothing carried over from the 19th, nothing dated the 21st or later.',
};

export const REGIONS = ['Europe', 'Americas', 'Asia', 'Africa', 'Middle East', 'Oceania', 'World'];

export const REGION_INK = {
  Europe: '#b21e22',
  Americas: '#12100e',
  Asia: '#a8842c',
  Africa: '#b21e22',
  'Middle East': '#12100e',
  Oceania: '#a8842c',
  World: '#b21e22',
};

export const BEAT_ORDER = [
  'war', 'diplomacy', 'courts', 'markets', 'climate', 'sport', 'science',
  'health', 'migration', 'technology', 'disaster', 'energy', 'domestic politics', 'media',
];

// slot: 'lead' | 'bandA' | 'bandB' | 'brief'
export const STORIES = [
  // ================= LEADS =================
  {
    n: 3, region: 'Europe', tag: 'EUR', beat: 'war', slot: 'lead', art: 'bridge',
      headline: '400 drones, 8 dead, three Kyiv bridges hit',
      deck: '110+ missiles, 27 of them ballistic, on energy and rail sites \u2014 Zelensky, Reuters',
      outlet: 'Reuters',
    },
    {
      n: 5, region: 'Europe', tag: 'EUR', beat: 'diplomacy', slot: 'lead', art: 'lecterns',
      headline: 'Europe demands a seat; Moscow says no',
      deck: 'Ryabkov rejects even a \u201cquasi-NATO\u201d formula for Kyiv \u2014 Reuters',
      outlet: 'Reuters',
    },
    {
      n: 10, region: 'Americas', tag: 'AME', beat: 'markets', slot: 'lead', art: 'bars',
      headline: 'Anthropic\u2019s IPO haul rises to $93.5bn',
      deck: 'Greenshoe exercised on 980m shares at $83 \u2014 the largest listing on record',
      outlet: 'Reuters',
    },

    // ================= BAND A (drawn) =================
    { n: 7, region: 'Asia', tag: 'ASI', beat: 'disaster', slot: 'bandA', art: 'cyclone',
      headline: 'Cyclone Akvan lands in Odisha; 300,000 moved out',
      outlet: 'IMD' },
    { n: 22, region: 'Africa', tag: 'AFR', beat: 'migration', slot: 'bandA', art: 'pirogue',
      headline: 'Senegal boat capsizes, dozens missing', outlet: 'Al Jazeera' },
    { n: 28, region: 'Oceania', tag: 'OCE', beat: 'climate', slot: 'bandA', art: 'atoll',
      headline: 'Pacific turns on the COP31 draft', outlet: 'PACNEWS' },

    // ================= BAND B (drawn) =================
    { n: 43, region: 'World', tag: 'WLD', beat: 'markets', slot: 'bandB', art: 'rout',
      headline: 'Asia\u2019s chip rout: Taiex -6.2%, Kospi -5.2%',
      outlet: 'Reuters' },
    { n: 44, region: 'Europe', tag: 'EUR', beat: 'diplomacy', slot: 'bandB', art: 'reset',
      headline: 'UK and EU sign a reset: food, carbon, youth',
      outlet: 'GOV.UK' },
    { n: 2, region: 'Europe', tag: 'EUR', beat: 'war', slot: 'bandB', art: 'cone',
      headline: 'A Russian missile falls on Poland', outlet: 'Reuters' },
    { n: 24, region: 'Africa', tag: 'AFR', beat: 'markets', slot: 'bandB', art: 'excavator',
      headline: 'Kenya\u2019s $60bn minerals tender won', outlet: 'eriinfo' },
    { n: 12, region: 'Americas', tag: 'AME', beat: 'domestic politics', slot: 'bandB', art: 'ballot',
      headline: 'Peltola takes Alaska; 56 Senate seats', outlet: 'AP' },
    { n: 32, region: 'World', tag: 'WLD', beat: 'technology', slot: 'bandB', art: 'server',
      headline: 'US cyber chief replaced mid-outage', outlet: 'CNN' },

  // ================= BRIEFS =================
  { n: 41, region: 'Europe', tag: 'EUR', beat: 'markets', slot: 'brief', art: null,
    headline: 'NATO reaffirms EUR 70bn of aid for 2026', outlet: 'Reuters' },
  { n: 1, region: 'Europe', tag: 'EUR', beat: 'energy', slot: 'brief', art: null,
    headline: 'Blackouts in Kyiv and ten regions', outlet: 'Nekrasov' },
  { n: 11, region: 'Americas', tag: 'AME', beat: 'media', slot: 'brief', art: null,
    headline: 'GTA VI sells 24.6m copies in a day', outlet: 'Sensor Tower' },
  { n: 4, region: 'Asia', tag: 'ASI', beat: 'diplomacy', slot: 'brief', art: null,
    headline: 'Xi and Albanese hail a trade turnaround', outlet: 'Reuters' },
  { n: 19, region: 'Middle East', tag: 'MEA', beat: 'energy', slot: 'brief', art: null,
    headline: 'Two supertankers burn off Hormuz', outlet: 'AP' },
  { n: 42, region: 'Asia', tag: 'ASI', beat: 'diplomacy', slot: 'brief', art: null,
    headline: 'Beijing to Tokyo: correct your words', outlet: 'China MFA' },
  { n: 6, region: 'Asia', tag: 'ASI', beat: 'diplomacy', slot: 'brief', art: null,
    headline: 'Trump briefs Takaichi on the summit', outlet: 'NPR' },
  { n: 45, region: 'World', tag: 'WLD', beat: 'markets', slot: 'brief', art: null,
    headline: 'SoftBank -14.5%; TSMC -6%; Samsung -6%', outlet: 'Anadolu' },
  { n: 8, region: 'Asia', tag: 'ASI', beat: 'diplomacy', slot: 'brief', art: null,
    headline: 'Nepal PM visits India on 22 November', outlet: 'Nepal FSec' },
  { n: 9, region: 'Asia', tag: 'ASI', beat: 'markets', slot: 'brief', art: null,
    headline: 'PNG opens a consulate in Guangzhou', outlet: 'Trade Min.' },
  { n: 13, region: 'Americas', tag: 'AME', beat: 'courts', slot: 'brief', art: null,
    headline: 'Court lets Venezuela TPS end, for now', outlet: 'Democracy Now' },
  { n: 14, region: 'Americas', tag: 'AME', beat: 'climate', slot: 'brief', art: null,
    headline: 'Brazil recognises 362,000 hectares', outlet: 'Al Jazeera' },
  { n: 15, region: 'Americas', tag: 'AME', beat: 'domestic politics', slot: 'brief', art: null,
    headline: 'Bogota marches against a tax bill', outlet: 'Al Jazeera' },
  { n: 16, region: 'Americas', tag: 'AME', beat: 'courts', slot: 'brief', art: null,
    headline: 'A judge holds ICE in contempt', outlet: 'Democracy Now' },
  { n: 23, region: 'Africa', tag: 'AFR', beat: 'war', slot: 'brief', art: null,
    headline: '260m children live near fighting', outlet: 'Save the Children' },
  { n: 25, region: 'Africa', tag: 'AFR', beat: 'diplomacy', slot: 'brief', art: null,
    headline: 'Somalia expels the UAE ambassador', outlet: 'eriinfo' },
  { n: 30, region: 'World', tag: 'WLD', beat: 'climate', slot: 'brief', art: null,
    headline: 'UN: progress on 44 of 96 indicators', outlet: 'UN News' },
  { n: 18, region: 'Middle East', tag: 'MEA', beat: 'war', slot: 'brief', art: null,
    headline: 'Militiamen quit Jurf al-Sakhar', outlet: 'Reuters' },
  { n: 20, region: 'Middle East', tag: 'MEA', beat: 'domestic politics', slot: 'brief', art: null,
    headline: 'Senate keeps the Iran war going, 51-48', outlet: 'AP' },
  { n: 21, region: 'Middle East', tag: 'MEA', beat: 'war', slot: 'brief', art: null,
    headline: 'Yemen strikes kill 15; debris hits Riyadh', outlet: 'AP' },
  { n: 35, region: 'Oceania', tag: 'OCE', beat: 'sport', slot: 'brief', art: null,
    headline: 'Wellington: NZ 368, India 68 for none', outlet: 'LiveScore' },
  { n: 27, region: 'Oceania', tag: 'OCE', beat: 'migration', slot: 'brief', art: null,
    headline: 'Fiji: 48,078 left in a single year', outlet: 'Fiji NPP' },
  { n: 29, region: 'World', tag: 'WLD', beat: 'courts', slot: 'brief', art: null,
    headline: 'South Africa faces an arms inquiry', outlet: 'eriinfo' },
  { n: 31, region: 'World', tag: 'WLD', beat: 'energy', slot: 'brief', art: null,
    headline: 'Brent at $92.57 as Hormuz grinds on', outlet: 'Fortune' },
  { n: 46, region: 'Europe', tag: 'EUR', beat: 'diplomacy', slot: 'brief', art: null,
    headline: 'Erasmus+ opens to UK students in 2027', outlet: 'GOV.UK' },
  { n: 47, region: 'Europe', tag: 'EUR', beat: 'energy', slot: 'brief', art: null,
    headline: 'UK and EU link carbon markets by 2028', outlet: 'GOV.UK' },
];

export const NUMBERS = [
  { value: '400+', label: 'drones Russia fired overnight' },
  { value: '110+', label: 'missiles, 27 of them ballistic' },
  { value: '8', label: 'killed in Ukraine, 6 of them in Kyiv' },
  { value: '24.6m', label: 'GTA VI copies sold on day one' },
  { value: '$2.36bn', label: 'GTA VI\u2019s first-day revenue' },
  { value: '$93.5bn', label: 'Anthropic\u2019s IPO, the largest on record' },
];

export const EXCLUDED = [
  'Shenzhen trilateral summit \u2014 held 19 Nov.',
  '\u201cDeclaration toward Peace\u201d \u2014 signed 19 Nov.',
  'ICJ Myanmar genocide ruling \u2014 given 19 Nov.',
  'Hegseth in Caracas, US-Venezuela pact \u2014 18 Nov.',
  'Riyadh tower strike \u2014 19 Nov.',
  'Anything dated 21 Nov or later.',
];

export function counts() {
  const c = {};
  for (const r of REGIONS) c[r] = 0;
  for (const s of STORIES) c[s.region] = (c[s.region] || 0) + 1;
  return c;
}

export function tally() {
  const c = counts();
  return REGIONS.map((r) => ({ region: r, n: c[r], ink: REGION_INK[r] }));
}

export function beats() {
  return [...new Set(STORIES.map((s) => s.beat))].sort();
}
