export type QrTemplate = {
  id: string;
  name: string;
  description: string;
  content: string;
  dark: string;
  light: string;
  size: number;
  logo: string | null;
};

const svgCrown = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${color}"/><path d="M25 35l10 20 15-25 15 25 10-20v25H25z" fill="#d4a73c" stroke="#a06d1d" stroke-width="1.5"/></svg>`
  )}`;

const svgMonogram = (letter: string, bg: string, fg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="${bg}"/><text x="50" y="68" font-family="Georgia,serif" font-size="52" font-weight="700" fill="${fg}" text-anchor="middle">${letter}</text></svg>`
  )}`;

const svgShield = (bg: string, fg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5L90 20v30c0 25-18 38-40 45C28 88 10 75 10 50V20z" fill="${bg}" stroke="${fg}" stroke-width="2"/><path d="M35 45l10 10 20-22" fill="none" stroke="${fg}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  )}`;

const svgStar = (bg: string, fg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="${bg}"/><path d="M50 18l8 22 23 1-18 14 7 22-20-13-20 13 7-22-18-14 23-1z" fill="${fg}"/></svg>`
  )}`;

export const TEMPLATES: QrTemplate[] = [
  {
    id: 'royal-crest',
    name: 'Royal Crest',
    description: 'A noble crown emblem on a deep obsidian palette.',
    content: 'https://aurea.studio',
    dark: '#1c1828',
    light: '#fbf7ed',
    size: 1440,
    logo: svgCrown('#1c1828'),
  },
  {
    id: 'gold-monogram',
    name: 'Gold Monogram',
    description: 'A gilded serif monogram crest on ivory parchment.',
    content: 'https://aurea.studio',
    dark: '#1c1828',
    light: '#f6eccf',
    size: 1440,
    logo: svgMonogram('A', '#1c1828', '#d4a73c'),
  },
  {
    id: 'emerald-seal',
    name: 'Emerald Seal',
    description: 'A deep forest palette with a protective shield crest.',
    content: 'https://aurea.studio',
    dark: '#064e3b',
    light: '#ecfdf5',
    size: 1440,
    logo: svgShield('#064e3b', '#ecfdf5'),
  },
  {
    id: 'burgundy-mark',
    name: 'Burgundy Mark',
    description: 'A wine-dark palette crowned with a radiant star.',
    content: 'https://aurea.studio',
    dark: '#4a0e1f',
    light: '#fdf2f4',
    size: 1440,
    logo: svgStar('#4a0e1f', '#fdf2f4'),
  },
  {
    id: 'sapphire-crown',
    name: 'Sapphire Crown',
    description: 'Midnight-blue royal palette with a golden crown seal.',
    content: 'https://aurea.studio',
    dark: '#0c1e3d',
    light: '#eef4ff',
    size: 1440,
    logo: svgCrown('#0c1e3d'),
  },
  {
    id: 'classic-regal',
    name: 'Classic Regal',
    description: 'Timeless black and white with a monogram seal.',
    content: 'https://aurea.studio',
    dark: '#000000',
    light: '#ffffff',
    size: 1080,
    logo: svgMonogram('A', '#000000', '#d4a73c'),
  },
];
