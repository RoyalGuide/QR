import { useState, useCallback, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  RefreshCw,
  Upload,
  X,
  FileText,
  Sparkles,
  Crown,
  ShieldCheck,
  Zap,
  Palette,
  Image as ImageIcon,
  ArrowRight,
  Check,
  Star,
  Layers,
  Globe,
  Lock,
} from 'lucide-react';

type Preset = {
  name: string;
  dark: string;
  light: string;
};

const PRESETS: Preset[] = [
  { name: 'Royal Gold', dark: '#1c1828', light: '#fbf7ed' },
  { name: 'Obsidian', dark: '#070608', light: '#e8e3d3' },
  { name: 'Emerald', dark: '#064e3b', light: '#ecfdf5' },
  { name: 'Burgundy', dark: '#4a0e1f', light: '#fdf2f4' },
  { name: 'Sapphire', dark: '#0c1e3d', light: '#eef4ff' },
  { name: 'Classic', dark: '#000000', light: '#ffffff' },
];

const SIZES = [
  { label: 'HD', value: 1080 },
  { label: '2K', value: 1440 },
  { label: 'Ultra', value: 2160 },
];

type Stat = { value: string; label: string };
const STATS: Stat[] = [
  { value: '2.1M+', label: 'Codes Crafted' },
  { value: '99.9%', label: 'Scan Reliability' },
  { value: '4K', label: 'Max Resolution' },
  { value: '120+', label: 'Countries' },
];

type Feature = { icon: typeof Crown; title: string; desc: string };
const FEATURES: Feature[] = [
  { icon: Crown, title: 'Crown-Grade Clarity', desc: 'Up to 2160px output with highest error correction — sharp on every screen and print.' },
  { icon: ShieldCheck, title: 'Scannable Guarantee', desc: 'Level-H error correction means your code survives wear, tearing, and logos.' },
  { icon: Palette, title: 'Bespoke Palettes', desc: 'Curated royal presets or unlimited custom colors to match your brand identity.' },
  { icon: ImageIcon, title: 'Crest & Logos', desc: 'Center your brand crest with automatic background framing for a regal touch.' },
  { icon: Zap, title: 'Instant Forge', desc: 'Generate studio-quality codes in milliseconds, right in your browser. No upload.' },
  { icon: Lock, title: 'Private by Design', desc: 'Everything runs on your device. Your data never touches a server.' },
];

type Step = { n: string; title: string; desc: string };
const STEPS: Step[] = [
  { n: '01', title: 'Compose', desc: 'Enter a URL, message, or any text you want to encode.' },
  { n: '02', title: 'Adorn', desc: 'Pick a royal palette, fine-tune the size, and optionally add your crest.' },
  { n: '03', title: 'Forge', desc: 'Generate a pixel-perfect HD code and download it in one click.' },
];

function App() {
  const [text, setText] = useState('https://aurea.studio');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(1440);
  const [darkColor, setDarkColor] = useState('#1c1828');
  const [lightColor, setLightColor] = useState('#fbf7ed');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [filename, setFilename] = useState('aurea-qrcode');
  const [activePreset, setActivePreset] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPreset = (preset: Preset, idx: number) => {
    setDarkColor(preset.dark);
    setLightColor(preset.light);
    setActivePreset(idx);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        setLogo(canvas.toDataURL('image/png', 1.0));
        setError('');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if (!text) throw new Error('Please enter some text');
      const canvas = document.createElement('canvas');
      const qrSize = size;
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
      if (!ctx) throw new Error('Failed to get canvas context');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: qrSize,
        margin: 1,
        color: { dark: darkColor, light: lightColor },
        errorCorrectionLevel: 'H',
        quality: 1.0,
      });
      const qrImage = new Image();
      qrImage.src = qrDataUrl;
      await new Promise((resolve) => { qrImage.onload = resolve; });
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo;
        await new Promise((resolve) => { logoImg.onload = resolve; });
        const logoSize = qrSize * 0.25;
        const logoX = (qrSize - logoSize) / 2;
        const logoY = (qrSize - logoSize) / 2;
        ctx.fillStyle = lightColor;
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      }
      setQrCodeUrl(canvas.toDataURL('image/png', 1.0));
      const defaultName = text.startsWith('http')
        ? new URL(text).hostname.replace(/[^a-z0-9]/gi, '-')
        : text.slice(0, 30).replace(/[^a-z0-9]/gi, '-');
      setFilename(defaultName || 'aurea-qrcode');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  }, [text, size, darkColor, lightColor, logo]);

  const downloadQRCode = useCallback(() => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${filename.trim() || 'aurea-qrcode'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrCodeUrl, filename]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-gold-700/10 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-gold-600/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d4a73c 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Decorative top border */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

      {/* Navigation */}
      <nav className="relative z-40 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-700">
            <Crown className="h-6 w-6 text-ink-950" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold tracking-wide gold-text">Aurea</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-200/50">QR Atelier</span>
          </div>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#studio" className="text-sm text-gold-100/70 transition hover:text-gold-200">Studio</a>
          <a href="#features" className="text-sm text-gold-100/70 transition hover:text-gold-200">Features</a>
          <a href="#process" className="text-sm text-gold-100/70 transition hover:text-gold-200">Process</a>
        </div>
        <a href="#studio" className="btn-ghost-gold rounded-full px-5 py-2.5 text-sm font-medium">
          Launch Studio
        </a>
      </nav>

      {/* Hero */}
      <header className="relative z-10 px-6 pt-12 pb-24 lg:px-12 lg:pt-20">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-4 py-1.5 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-200/80">HD QR Code Atelier</span>
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-gold-50 text-shadow-gold sm:text-7xl lg:text-8xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Forge Codes
            <br />
            <span className="gold-text italic">Worthy of a Crown</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gold-100/60 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            A studio-grade QR code generator crafting high-definition, scannable works of art —
            with royal palettes, crest support, and pixel-perfect output up to 4K.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#studio" className="btn-gold group flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold">
              Enter the Studio
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#features" className="btn-ghost-gold rounded-full px-8 py-4 text-sm font-medium">
              Explore Features
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold-400/15 bg-gold-400/5 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-900/60 p-6 text-center">
              <div className="font-display text-3xl font-semibold gold-text">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-200/50">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Studio / Generator */}
      <section id="studio" className="relative z-10 px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="ornament inline-block text-xs uppercase tracking-[0.35em] text-gold-300/70">The Studio</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">Compose Your Code</h2>
            <p className="mx-auto mt-4 max-w-xl text-gold-100/50">
              Every element is yours to command — color, size, and crest. Craft, preview, and download in HD.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            {/* Controls Panel */}
            <div className="glass gold-border rounded-3xl p-8 glow-gold">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10">
                  <Palette className="h-5 w-5 text-gold-300" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-gold-50">Composition</h3>
              </div>

              {/* Content input */}
              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-200/60">
                  <Layers className="h-3.5 w-3.5" /> Content
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-xl border border-gold-400/15 bg-ink-800/60 px-4 py-3 text-gold-50 outline-none transition placeholder:text-gold-200/30 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20"
                  placeholder="Enter URL or text"
                />
              </div>

              {/* Size selector */}
              <div className="mb-6">
                <label className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-200/60">
                  <Zap className="h-3.5 w-3.5" /> Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSize(s.value)}
                      className={`relative rounded-xl border px-3 py-3 text-sm font-medium transition ${
                        size === s.value
                          ? 'border-gold-400/60 bg-gold-400/10 text-gold-100'
                          : 'border-gold-400/15 bg-ink-800/40 text-gold-200/50 hover:border-gold-400/30'
                      }`}
                    >
                      {s.label}
                      <span className="block text-[10px] font-normal opacity-60">{s.value}px</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="mb-6">
                <label className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-200/60">
                  <Crown className="h-3.5 w-3.5" /> Royal Palettes
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {PRESETS.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p, i)}
                      className={`group flex flex-col items-center gap-1.5 rounded-xl border p-2 transition ${
                        activePreset === i ? 'border-gold-400/60 bg-gold-400/10' : 'border-gold-400/10 hover:border-gold-400/30'
                      }`}
                      title={p.name}
                    >
                      <span
                        className="h-8 w-full rounded-lg"
                        style={{ background: `linear-gradient(135deg, ${p.dark} 0 50%, ${p.light} 50% 100%)` }}
                      />
                      <span className="text-[9px] uppercase tracking-wide text-gold-200/60">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom colors */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-200/60">Foreground</label>
                  <div className="flex items-center gap-2 rounded-xl border border-gold-400/15 bg-ink-800/60 p-2">
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => { setDarkColor(e.target.value); setActivePreset(-1); }}
                      className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span className="text-sm text-gold-200/70">{darkColor}</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gold-200/60">Background</label>
                  <div className="flex items-center gap-2 rounded-xl border border-gold-400/15 bg-ink-800/60 p-2">
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => { setLightColor(e.target.value); setActivePreset(-1); }}
                      className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span className="text-sm text-gold-200/70">{lightColor}</span>
                  </div>
                </div>
              </div>

              {/* Logo upload */}
              <div className="mb-6">
                <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-200/60">
                  <ImageIcon className="h-3.5 w-3.5" /> Crest / Logo
                </label>
                <div className="flex items-center gap-3">
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gold-400/20 bg-ink-800/50 px-4 py-3 text-sm text-gold-100 transition hover:border-gold-400/40 hover:bg-gold-400/5"
                  >
                    <Upload className="h-4 w-4" />
                    {logo ? 'Change crest' : 'Upload crest'}
                  </button>
                  {logo && (
                    <button
                      onClick={removeLogo}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                      title="Remove crest"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {logo && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gold-200/60">
                    <Check className="h-4 w-4 text-gold-300" />
                    Crest attached — auto-framed with a backdrop.
                  </div>
                )}
              </div>

              {/* Generate button */}
              <button
                onClick={generateQRCode}
                disabled={loading}
                className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold disabled:opacity-60"
              >
                {loading ? (
                  <><RefreshCw className="h-5 w-5 animate-spin" /> Forging...</>
                ) : (
                  <><QrCode className="h-5 w-5" /> Forge QR Code</>
                )}
              </button>

              {error && (
                <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col">
              <div className="glass gold-border relative flex flex-1 flex-col items-center justify-center rounded-3xl p-10 glow-gold">
                {/* Decorative corners */}
                <span className="absolute left-4 top-4 h-8 w-8 border-l border-t border-gold-400/40" />
                <span className="absolute right-4 top-4 h-8 w-8 border-r border-t border-gold-400/40" />
                <span className="absolute bottom-4 left-4 h-8 w-8 border-b border-l border-gold-400/40" />
                <span className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-gold-400/40" />

                {qrCodeUrl ? (
                  <>
                    <div className="relative rounded-2xl bg-white p-6 shadow-2xl animate-pulse-gold">
                      <img
                        src={qrCodeUrl}
                        alt="Generated QR Code"
                        className="max-w-full"
                        style={{ width: Math.min(size, 380), height: Math.min(size, 380) }}
                      />
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-gold-200/40">
                      Preview · {size}×{size}px
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-dashed border-gold-400/25 bg-ink-800/30">
                        <QrCode className="h-20 w-20 text-gold-400/30" />
                      </div>
                      <div className="absolute -inset-4 -z-10 animate-spin-slow rounded-full border border-gold-400/10" />
                    </div>
                    <p className="mt-6 max-w-xs text-sm text-gold-100/40">
                      Your masterpiece will appear here. Compose your code and press Forge.
                    </p>
                  </div>
                )}
              </div>

              {/* Download bar */}
              {qrCodeUrl && (
                <div className="mt-6 glass gold-border rounded-2xl p-5 animate-fade-up">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gold-300" />
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="flex-1 rounded-lg border border-gold-400/15 bg-ink-800/60 px-3 py-2 text-sm text-gold-100 outline-none focus:border-gold-400/40"
                      placeholder="Filename"
                    />
                    <span className="text-sm text-gold-200/40">.png</span>
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="btn-gold mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                  >
                    <Download className="h-5 w-5" /> Download HD
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="ornament inline-block text-xs uppercase tracking-[0.35em] text-gold-300/70">Why Aurea</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">
              Crafted to a Higher Standard
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-gold-400/12 bg-ink-900/60 p-7 transition hover:border-gold-400/30 hover:bg-ink-800/60 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-400/5 blur-2xl transition group-hover:bg-gold-400/10" />
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400/15 to-gold-700/10">
                    <f.icon className="h-6 w-6 text-gold-300" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gold-50">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gold-100/50">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="relative z-10 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <span className="ornament inline-block text-xs uppercase tracking-[0.35em] text-gold-300/70">The Ritual</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">Three Steps to Perfection</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[58%] top-8 hidden h-px w-full bg-gradient-to-r from-gold-400/40 to-transparent md:block" />
                )}
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30 bg-ink-900">
                  <span className="font-display text-xl font-semibold gold-text">{s.n}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-gold-50">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-gold-100/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="relative z-10 px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
            ))}
          </div>
          <blockquote className="font-display text-2xl font-medium italic leading-relaxed text-gold-50 sm:text-3xl">
            “The codes we forge with Aurea scan flawlessly from billboards to business cards.
            It feels less like a tool and more like an atelier.”
          </blockquote>
          <div className="mt-6 text-sm uppercase tracking-[0.2em] text-gold-200/50">
            — Maison Lumière, Paris
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 lg:px-12">
        <div className="glass gold-border relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center glow-gold">
          <div className="absolute -left-20 top-0 h-40 w-40 animate-float-slow rounded-full bg-gold-400/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-40 w-40 animate-float-slower rounded-full bg-gold-600/10 blur-3xl" />
          <div className="relative">
            <Crown className="mx-auto h-10 w-10 text-gold-300" />
            <h2 className="mt-6 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">
              Begin Your Creation
            </h2>
            <p className="mx-auto mt-4 max-w-md text-gold-100/50">
              No sign-up. No upload. Just pure, high-definition craft — instantly in your browser.
            </p>
            <a href="#studio" className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold">
              Enter the Studio <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold-400/10 px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-700">
              <Crown className="h-4 w-4 text-ink-950" />
            </div>
            <span className="font-display text-lg font-semibold gold-text">Aurea</span>
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-gold-200/40">
            <Globe className="h-4 w-4" />
            <span>Crafted for creators worldwide</span>
          </div>
          <div className="text-xs text-gold-200/40">© 2026 Aurea QR Atelier</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
