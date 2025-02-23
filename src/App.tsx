import React, { useState, useCallback, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, RefreshCw, Github, Upload, X, FileText } from 'lucide-react';

function App() {
  const [text, setText] = useState('https://example.com');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(1080); // Default to 1080p
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [filename, setFilename] = useState('qrcode-hd');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const maxSize = 300; // Increased logo size for better quality
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!text) {
        throw new Error('Please enter some text');
      }

      const canvas = document.createElement('canvas');
      const qrSize = size;
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Generate QR code with high quality settings
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: qrSize,
        margin: 1,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: 'H', // Highest error correction for better logo support
        quality: 1.0 // Highest quality setting
      });

      // Draw QR code
      const qrImage = new Image();
      qrImage.src = qrDataUrl;
      await new Promise((resolve) => {
        qrImage.onload = resolve;
      });
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

      // Add logo if present
      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
        });

        const logoSize = qrSize * 0.25; // Increased logo size for better visibility
        const logoX = (qrSize - logoSize) / 2;
        const logoY = (qrSize - logoSize) / 2;

        // Add white background for logo with smooth edges
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 + 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw logo with high quality
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      }

      // Convert to high-quality PNG
      setQrCodeUrl(canvas.toDataURL('image/png', 1.0));
      
      // Set a default filename based on the QR content
      const defaultName = text.startsWith('http') 
        ? new URL(text).hostname.replace(/[^a-z0-9]/gi, '-')
        : text.slice(0, 30).replace(/[^a-z0-9]/gi, '-');
      setFilename(defaultName || 'qrcode-hd');
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
    link.download = `${filename.trim() || 'qrcode-hd'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrCodeUrl, filename]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <QrCode className="w-8 h-8" />
            <h1 className="text-3xl font-bold">HD QR Code Generator</h1>
          </div>

          {/* Input Section */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Content</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter URL or text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Size (px)</label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  min="1080"
                  max="2160"
                  step="108"
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-xs text-gray-400 mt-1">Min: 1080px (Full HD)</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dark Color</label>
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-full h-10 bg-gray-700 rounded-md cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Light Color</label>
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-full h-10 bg-gray-700 rounded-md cursor-pointer"
                />
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Logo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors w-full"
                  >
                    <Upload className="w-5 h-5" />
                    {logo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                </div>
                {logo && (
                  <button
                    onClick={removeLogo}
                    className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    title="Remove Logo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {logo && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={logo} alt="Logo Preview" className="w-8 h-8 object-contain" />
                  <span className="text-sm text-gray-400">Logo uploaded</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateQRCode}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </>
                )}
              </button>
              
              {qrCodeUrl && (
                <button
                  onClick={downloadQRCode}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors w-full"
                >
                  <Download className="w-5 h-5" />
                  Download HD
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Filename Input (shows only when QR code is generated) */}
            {qrCodeUrl && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium">Download Settings</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="Enter filename"
                  />
                  <span className="text-gray-400 text-sm">.png</span>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8">
              <img
                src={qrCodeUrl}
                alt="Generated QR Code"
                className="max-w-full"
                style={{ width: Math.min(size, 400), height: Math.min(size, 400) }}
              />
              <p className="text-gray-500 mt-2 text-sm">Preview (scaled down, download for full resolution)</p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;