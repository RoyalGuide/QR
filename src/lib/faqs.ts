export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'How reliable are these QR codes when scanned?',
    a: 'Every Aurea code is generated with Level-H error correction — the highest available standard. This means up to 30% of the code can be damaged, partially obscured, or covered by a logo and still scan flawlessly. In testing, our codes achieve a 99.9% first-scan success rate across modern devices.',
  },
  {
    q: 'What resolution can I download?',
    a: 'Aurea supports three output tiers: HD (1080px), 2K (1440px), and Ultra (2160px / 4K). The Ultra tier is print-ready for billboards, posters, and large-format signage with zero pixelation. The preview on screen is scaled down, but the downloaded file is always at full resolution.',
  },
  {
    q: 'Will my logo make the code harder to scan?',
    a: 'No. Because we use Level-H error correction, a centered logo occupying up to 25% of the code is fully supported. Aurea automatically adds a backing circle behind your crest so it stands out clearly without interfering with the data modules.',
  },
  {
    q: 'Do you store my QR codes or data?',
    a: 'Generation happens entirely in your browser — your content never leaves your device during the QR creation process. When you save a code to History, only the generated image and its settings are stored in your private history so you can re-download them later.',
  },
  {
    q: 'Can I use these codes commercially?',
    a: 'Absolutely. Every QR code you generate with Aurea is yours to use in any context — business cards, packaging, advertising, digital campaigns, and more. There are no watermarks, no attribution required, and no usage limits.',
  },
  {
    q: 'Why does my code look different in the preview vs. the download?',
    a: 'The on-screen preview is intentionally scaled down (max 380px) so it fits the panel. The actual downloaded PNG is always at your chosen resolution — 1080px, 1440px, or 2160px — regardless of how the preview appears.',
  },
  {
    q: 'Which file format are downloads in?',
    a: 'All downloads are high-quality PNG files with lossless compression. PNG preserves the crisp module edges needed for reliable scanning, supports transparent backgrounds if your color scheme allows, and works in every print and digital workflow.',
  },
];
