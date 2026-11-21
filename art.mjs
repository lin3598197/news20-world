// art.mjs — flat silhouettes, each authored in a 160 x 96 viewBox (exactly 5:3).
// Palette: paper, ink, one red, one gold. No gradients, no hatching, nothing under 8 units.

const PAPER = '#f4f0e6';
const INK = '#12100e';
const RED = '#b21e22';
const GOLD = '#a8842c';

const frame = (body) =>
  `<svg viewBox="0 0 160 96" width="100%" height="100%" preserveAspectRatio="none" shape-rendering="crispEdges">${body}</svg>`;

const fns = {};

// 1. A bridge with a broken span over a wide river, night, one red flash.
fns.bridge = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="70" width="160" height="26" fill="${GOLD}"/>
  <rect x="0" y="40" width="62" height="12" fill="${PAPER}"/>
  <rect x="98" y="40" width="62" height="12" fill="${PAPER}"/>
  <polygon points="62,52 98,52 90,70 70,70" fill="${PAPER}"/>
  <rect x="18" y="52" width="12" height="34" fill="${PAPER}"/>
  <rect x="130" y="52" width="12" height="34" fill="${PAPER}"/>
  <circle cx="132" cy="16" r="11" fill="${RED}"/>`);

// 2. Two flags turned away from each other over a table line: the split.
fns.lecterns = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="72" width="160" height="24" fill="${GOLD}"/>
  <rect x="0" y="64" width="160" height="8" fill="${PAPER}"/>
  <rect x="66" y="68" width="10" height="28" fill="${PAPER}"/>
  <rect x="50" y="10" width="9" height="54" fill="${PAPER}"/>
  <rect x="101" y="10" width="9" height="54" fill="${PAPER}"/>
  <rect x="6" y="10" width="44" height="26" fill="${PAPER}"/>
  <rect x="110" y="10" width="44" height="26" fill="${RED}"/>`);

// 3. Four columns of a chart, the last far taller, in red.
fns.bars = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${PAPER}"/>
  <rect x="12" y="88" width="136" height="8" fill="${INK}"/>
  <rect x="16" y="56" width="26" height="32" fill="${INK}"/>
  <rect x="50" y="44" width="26" height="44" fill="${INK}"/>
  <rect x="84" y="64" width="26" height="24" fill="${INK}"/>
  <rect x="118" y="10" width="26" height="78" fill="${RED}"/>`);

// 4. A container ship in profile: long hull, stacked boxes, black sky, gold water.
fns.ship = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="70" width="160" height="26" fill="${GOLD}"/>
  <polygon points="10,58 150,58 136,72 24,72" fill="${PAPER}"/>
  <rect x="118" y="40" width="22" height="18" fill="${PAPER}"/>
  <rect x="24" y="46" width="20" height="12" fill="${RED}"/>
  <rect x="46" y="46" width="20" height="12" fill="${PAPER}"/>
  <rect x="68" y="46" width="20" height="12" fill="${GOLD}"/>
  <rect x="90" y="46" width="20" height="12" fill="${PAPER}"/>
  <rect x="35" y="34" width="20" height="12" fill="${PAPER}"/>
  <rect x="57" y="34" width="20" height="12" fill="${RED}"/>
  <rect x="79" y="34" width="20" height="12" fill="${PAPER}"/>`);

// 5. A palm-lined boulevard at dusk, one car, a red neon sign.
fns.car = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="62" width="160" height="34" fill="${GOLD}"/>
  <rect x="100" y="8" width="48" height="22" fill="${RED}"/>
  <rect x="12" y="34" width="9" height="28" fill="${PAPER}"/>
  <rect x="4" y="24" width="13" height="10" fill="${PAPER}"/>
  <rect x="18" y="24" width="13" height="10" fill="${PAPER}"/>
  <polygon points="52,62 60,42 104,42 114,62" fill="${PAPER}"/>
  <circle cx="68" cy="66" r="11" fill="${INK}"/>
  <circle cx="98" cy="66" r="11" fill="${INK}"/>`);

// 6. A long tanker hull low in the water, a plume of smoke.
fns.tanker = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="68" width="160" height="28" fill="${GOLD}"/>
  <rect x="6" y="52" width="146" height="18" fill="${PAPER}"/>
  <rect x="112" y="28" width="18" height="26" fill="${PAPER}"/>
  <circle cx="30" cy="28" r="14" fill="${PAPER}"/>
  <circle cx="52" cy="16" r="11" fill="${PAPER}"/>
  <circle cx="18" cy="12" r="9" fill="${PAPER}"/>`);

// 7. An upturned pirogue floating in open water, one oar.
fns.pirogue = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="56" width="160" height="40" fill="${GOLD}"/>
  <path d="M12 54 Q80 18 148 54 Q80 66 12 54 Z" fill="${PAPER}"/>
  <rect x="24" y="76" width="76" height="10" fill="${PAPER}" transform="rotate(-10 62 81)"/>
  <rect x="96" y="78" width="14" height="10" fill="${RED}"/>`);

// 8. An atoll from above: a broken ring of land round a lagoon.
fns.atoll = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <ellipse cx="80" cy="48" rx="72" ry="44" fill="${GOLD}"/>
  <ellipse cx="78" cy="46" rx="42" ry="23" fill="${PAPER}"/>
  <polygon points="128,60 160,74 160,96 122,84" fill="${INK}"/>
  <polygon points="6,26 22,18 30,34 12,40" fill="${PAPER}"/>`);

// 9. A fallen missile lying half-buried in a field, fins up, one red marker post.
fns.cone = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${PAPER}"/>
  <rect x="0" y="56" width="160" height="40" fill="${INK}"/>
  <g transform="rotate(-10 72 62)">
    <rect x="24" y="50" width="94" height="24" fill="${PAPER}"/>
    <polygon points="118,50 150,62 118,74" fill="${PAPER}"/>
    <rect x="34" y="32" width="15" height="20" fill="${PAPER}"/>
    <rect x="80" y="32" width="15" height="20" fill="${PAPER}"/>
    <rect x="58" y="50" width="14" height="24" fill="${RED}"/>
  </g>
  <rect x="132" y="10" width="10" height="46" fill="${RED}"/>
  <rect x="126" y="10" width="22" height="10" fill="${PAPER}"/>`);

// 10. A football on the spot, a goal frame behind, flat pitch.
fns.football = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${GOLD}"/>
  <rect x="24" y="8" width="112" height="10" fill="${PAPER}"/>
  <rect x="24" y="8" width="10" height="46" fill="${PAPER}"/>
  <rect x="126" y="8" width="10" height="46" fill="${PAPER}"/>
  <rect x="34" y="46" width="92" height="8" fill="${PAPER}"/>
  <circle cx="80" cy="70" r="18" fill="${INK}"/>
  <rect x="70" y="62" width="20" height="16" fill="${PAPER}"/>
  <rect x="72" y="84" width="16" height="8" fill="${RED}"/>`);

// 11. A low concrete bunker cut into a hillside, one black entrance.
fns.bunker = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${GOLD}"/>
  <rect x="0" y="0" width="160" height="30" fill="${INK}"/>
  <rect x="0" y="30" width="160" height="8" fill="${PAPER}"/>
  <rect x="22" y="38" width="116" height="40" fill="${PAPER}"/>
  <rect x="66" y="48" width="28" height="30" fill="${INK}"/>
  <rect x="0" y="78" width="160" height="18" fill="${INK}"/>`);

// 12. An excavator bucket biting into a red hillside.
fns.excavator = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${RED}"/>
  <rect x="0" y="0" width="160" height="34" fill="${PAPER}"/>
  <rect x="14" y="64" width="56" height="32" fill="${INK}"/>
  <rect x="34" y="40" width="14" height="26" fill="${INK}"/>
  <rect x="40" y="30" width="66" height="14" fill="${INK}" transform="rotate(-18 44 38)"/>
  <polygon points="100,16 140,16 140,54 100,54" fill="${INK}"/>
  <rect x="110" y="26" width="20" height="12" fill="${GOLD}"/>`);

// 13. A double helix drawn as two thick ribbons, flat.
fns.helix = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${PAPER}"/>
  <path d="M44 4 Q112 26 44 48 Q112 70 44 92" fill="none" stroke="${RED}" stroke-width="14"/>
  <path d="M116 4 Q48 26 116 48 Q48 70 116 92" fill="none" stroke="${INK}" stroke-width="14"/>
  <rect x="62" y="30" width="38" height="11" fill="${INK}"/>
  <rect x="62" y="56" width="38" height="11" fill="${RED}"/>`);

// 16. A cyclone, drawn as one continuous spiral of thick white bands winding into
// a large red eye, over a flat coastline with two palms bent the same way.
fns.cyclone = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="0" y="72" width="160" height="24" fill="${GOLD}"/>
  <g transform="translate(96 40)">
    <path d="M0 0 C14 0 22 9 22 19 C22 31 12 39 0 39 C-16 39 -28 28 -28 13
             C-28 -5 -14 -19 4 -19 C26 -19 42 -4 42 17 C42 40 24 56 0 56"
          fill="none" stroke="${PAPER}" stroke-width="11" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="12" fill="${RED}"/>
    <circle cx="0" cy="0" r="4" fill="${INK}"/>
  </g>
  <path d="M14 72 L14 48" stroke="${PAPER}" stroke-width="5"/>
  <path d="M14 48 q13 -6 21 1" stroke="${PAPER}" stroke-width="5" fill="none"/>
  <path d="M32 72 L32 56" stroke="${PAPER}" stroke-width="5"/>
  <path d="M32 56 q12 -5 18 2" stroke="${PAPER}" stroke-width="5" fill="none"/>`);

// 17. A bar chart of bars falling away left to right, the last one long and red:
// a rout, unmistakably a decline rather than a rise.
fns.rout = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${PAPER}"/>
  <rect x="10" y="12" width="20" height="68" fill="${INK}"/>
  <rect x="38" y="26" width="20" height="54" fill="${INK}"/>
  <rect x="66" y="38" width="20" height="42" fill="${INK}"/>
  <rect x="94" y="48" width="20" height="32" fill="${INK}"/>
  <rect x="122" y="58" width="20" height="22" fill="${RED}"/>
  <rect x="6" y="80" width="148" height="7" fill="${INK}"/>`);

// 18. Two delegations facing each other across a table, a red document between
// them and a flag over each side — two parties concluding a deal.
fns.reset = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${PAPER}"/>
  <rect x="0" y="84" width="160" height="12" fill="${INK}"/>
  <rect x="6" y="10" width="34" height="22" fill="${RED}"/>
  <rect x="120" y="10" width="34" height="22" fill="${INK}"/>
  <rect x="8" y="46" width="12" height="26" fill="${INK}"/>
  <circle cx="14" cy="40" r="8" fill="${INK}"/>
  <rect x="140" y="46" width="12" height="26" fill="${INK}"/>
  <circle cx="146" cy="40" r="8" fill="${INK}"/>
  <rect x="30" y="70" width="100" height="9" fill="${INK}"/>
  <rect x="58" y="56" width="44" height="14" fill="${RED}"/>
  <rect x="8" y="58" width="20" height="12" fill="${INK}"/>
  <rect x="132" y="58" width="20" height="12" fill="${INK}"/>`);

// 14. A ballot paper going into the slot of a box, a mountain range behind.
fns.ballot = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${PAPER}"/>
  <polygon points="0,72 40,26 80,72" fill="${GOLD}"/>
  <polygon points="52,72 96,18 144,72" fill="${INK}"/>
  <rect x="24" y="60" width="112" height="36" fill="${INK}"/>
  <rect x="40" y="46" width="80" height="20" fill="${PAPER}"/>
  <rect x="40" y="20" width="80" height="28" fill="${PAPER}"/>
  <rect x="49" y="26" width="62" height="8" fill="${RED}"/>
  <rect x="49" y="38" width="40" height="6" fill="${INK}"/>
  <rect x="40" y="46" width="80" height="7" fill="${RED}"/>`);

// 15. A server rack with one red light among the rest.
fns.server = () =>
  frame(`
  <rect x="0" y="0" width="160" height="96" fill="${INK}"/>
  <rect x="32" y="4" width="96" height="88" fill="${PAPER}"/>
  <rect x="44" y="14" width="72" height="14" fill="${INK}"/>
  <rect x="44" y="34" width="72" height="14" fill="${INK}"/>
  <rect x="44" y="54" width="72" height="14" fill="${INK}"/>
  <rect x="44" y="74" width="72" height="12" fill="${INK}"/>
  <rect x="100" y="17" width="10" height="9" fill="${RED}"/>
  <rect x="100" y="37" width="10" height="9" fill="${GOLD}"/>
  <rect x="100" y="57" width="10" height="9" fill="${GOLD}"/>`);

export function artSvg(key, label = '') {
  const f = fns[key];
  const safe = String(label).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  if (!f)
    return `<svg viewBox="0 0 160 96" width="100%" height="100%"><rect width="160" height="96" fill="${PAPER}"/></svg>`;
  return f().replace('<svg ', `<svg aria-label="${safe}" `);
}

export const ART_KEYS = Object.keys(fns);
