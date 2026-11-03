import { useEffect, useState, useCallback } from 'react';
import { Download, Trash2, RefreshCw, History, Clock } from 'lucide-react';
import { supabase, type QrHistoryItem } from '../lib/supabase';

type Props = {
  refreshSignal: number;
  onReapply: (item: QrHistoryItem) => void;
};

function HistorySection({ refreshSignal, onReapply }: Props) {
  const [items, setItems] = useState<QrHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('qr_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(24);
      if (fetchError) throw fetchError;
      setItems(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshSignal]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const { error: delError } = await supabase.from('qr_history').delete().eq('id', id);
      if (delError) throw delError;
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  }, []);

  const handleDownload = useCallback((item: QrHistoryItem) => {
    if (!item.image_data) return;
    const link = document.createElement('a');
    link.href = item.image_data;
    link.download = `${item.filename || 'aurea-qrcode'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <section id="history" className="relative z-10 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="ornament inline-block text-xs uppercase tracking-[0.35em] text-gold-300/70">The Archive</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-gold-50 sm:text-5xl">Your Royal History</h2>
          <p className="mx-auto mt-4 max-w-xl text-gold-100/50">
            Every code you forge is saved here. Re-download instantly or load its settings back into the studio.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-gold-200/50">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading your archive...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="glass gold-border mx-auto flex max-w-md flex-col items-center rounded-3xl p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/20 bg-ink-800/50">
              <History className="h-8 w-8 text-gold-400/40" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold text-gold-50">No codes yet</h3>
            <p className="mt-2 text-sm text-gold-100/40">
              Forge your first QR code in the studio and it will appear here for instant re-download.
            </p>
            <a href="#studio" className="btn-ghost-gold mt-6 rounded-full px-6 py-3 text-sm font-medium">
              Go to Studio
            </a>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-gold-400/12 bg-ink-900/60 transition hover:border-gold-400/30"
              >
                {/* Thumbnail */}
                <div className="relative flex items-center justify-center bg-white p-4">
                  {item.image_data ? (
                    <img src={item.image_data} alt={item.content} className="h-32 w-32 object-contain" />
                  ) : (
                    <div className="h-32 w-32" />
                  )}
                </div>
                {/* Meta */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-gold-200/40">
                    <Clock className="h-3 w-3" />
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <p className="mt-2 truncate text-sm text-gold-100/70" title={item.content}>
                    {item.content}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gold-200/40">
                    <span className="rounded-md bg-gold-400/10 px-1.5 py-0.5">{item.size || 1080}px</span>
                    {item.has_logo && (
                      <span className="rounded-md bg-gold-400/10 px-1.5 py-0.5">Crest</span>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gold-400/20 bg-ink-800/50 px-3 py-2 text-xs font-medium text-gold-100 transition hover:border-gold-400/40 hover:bg-gold-400/5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                    <button
                      onClick={() => onReapply(item)}
                      className="flex items-center justify-center rounded-lg border border-gold-400/20 bg-ink-800/50 px-3 py-2 text-xs text-gold-100 transition hover:border-gold-400/40 hover:bg-gold-400/5"
                      title="Load into studio"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center justify-center rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/15"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HistorySection;
