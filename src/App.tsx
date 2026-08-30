import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import CanvasArea from './components/CanvasArea';
import HistorySection from './components/HistorySection';
import Lightbox from './components/Lightbox';
import Toasts from './components/Toasts';
import type { Toast } from './components/Toasts';
import { IconSparkle } from './components/icons';
import type { GenItem, Surprise } from './lib/data';
import {
  STYLES,
  SURPRISES,
  buildImageUrl,
  downloadImage,
  faDigits,
  randomSeed,
  ratioById,
  styleById,
  uid,
} from './lib/data';

const HKEY = 'khayal-negar-history-v1';
const TKEY = 'khayal-negar-total-v1';

function loadHistory(): GenItem[] {
  try {
    const raw = localStorage.getItem(HKEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? (arr as GenItem[]) : [];
  } catch {
    return [];
  }
}

function loadTotal(): number {
  try {
    const n = Number(localStorage.getItem(TKEY));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [styleId, setStyleId] = useState('none');
  const [ratioId, setRatioId] = useState('sq');
  const [modelId, setModelId] = useState('flux');
  const [count, setCount] = useState(1);
  const [seed, setSeed] = useState('');

  const [items, setItems] = useState<GenItem[]>([]);
  const [history, setHistory] = useState<GenItem[]>(loadHistory);
  const [total, setTotal] = useState<number>(loadTotal);
  const [durations, setDurations] = useState<number[]>([]);
  const [lightbox, setLightbox] = useState<GenItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generating = useMemo(() => items.some((i) => i.status === 'loading'), [items]);

  useEffect(() => {
    try {
      localStorage.setItem(HKEY, JSON.stringify(history.slice(0, 30)));
    } catch {
      /* حافظه پر است؛ بی‌خیال */
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(TKEY, String(total));
    } catch {
      /* ignore */
    }
  }, [total]);

  /* ---------- اعلان‌ها ---------- */
  const addToast = useCallback((msg: string, kind: Toast['kind'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  /* ---------- ساخت تصویر ---------- */
  const handleGenerate = useCallback(
    (sourcePrompt?: string) => {
      const p = (sourcePrompt ?? prompt).trim();
      if (!p) {
        addToast('اول توصیفی برای تصویر بنویس!', 'warn');
        textareaRef.current?.focus();
        return;
      }
      const style = styleById(styleId);
      const ratio = ratioById(ratioId) ?? ratioById('sq')!;
      const locked = seed.trim() !== '' ? Number(seed.trim()) : null;
      const baseSeed = locked ?? randomSeed();
      const full = style && style.tokens ? `${p}, ${style.tokens}` : p;

      const batch: GenItem[] = Array.from({ length: count }, (_, i) => {
        const s = locked !== null ? (baseSeed + i) % 2147483647 : randomSeed();
        return {
          id: uid(),
          url: buildImageUrl(full, ratio.w, ratio.h, s, modelId),
          prompt: full,
          userPrompt: p,
          styleId,
          ratioId: ratio.id,
          modelId,
          seed: s,
          w: ratio.w,
          h: ratio.h,
          status: 'loading',
          startedAt: Date.now(),
          attempt: 0,
        };
      });

      setItems(batch);
      addToast(
        count === 1 ? 'در حال ساخت تصویر…' : `در حال ساخت ${faDigits(count)} تصویر…`,
      );
    },
    [prompt, styleId, ratioId, modelId, count, seed, addToast],
  );

  /* ---------- رویدادهای کارت‌ها ---------- */
  const onDone = useCallback((id: string, durationMs: number) => {
    const it = itemsRef.current.find((i) => i.id === id);
    if (!it || it.status !== 'loading') return;
    const done: GenItem = { ...it, status: 'done', duration: durationMs };
    setItems((prev) => prev.map((i) => (i.id === id ? done : i)));
    setHistory((prev) => [done, ...prev.filter((h) => h.id !== id)].slice(0, 30));
    setTotal((t) => t + 1);
    setDurations((d) => [...d, durationMs].slice(-30));
  }, []);

  const onErrorItem = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id && i.status === 'loading' ? { ...i, status: 'error' } : i)),
      );
      addToast('تولید تصویر ناموفق بود', 'error');
    },
    [addToast],
  );

  const onTimeout = useCallback((id: string) => onErrorItem(id), [onErrorItem]);

  const onRetry = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const attempt = i.attempt + 1;
        return {
          ...i,
          status: 'loading',
          startedAt: Date.now(),
          attempt,
          url: buildImageUrl(i.prompt, i.w, i.h, i.seed, i.modelId, attempt),
        };
      }),
    );
  }, []);

  const onRegenerate = useCallback(
    (item: GenItem) => {
      const s = randomSeed();
      const fresh: GenItem = {
        ...item,
        id: uid(),
        seed: s,
        status: 'loading',
        startedAt: Date.now(),
        attempt: 0,
        duration: undefined,
        url: buildImageUrl(item.prompt, item.w, item.h, s, item.modelId),
      };
      setItems([fresh]);
      setLightbox(null);
      addToast('نسخهٔ تازه با بذر جدید در حال ساخت است…');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [addToast],
  );

  const onCopy = useCallback(
    async (item: GenItem) => {
      try {
        await navigator.clipboard.writeText(item.userPrompt);
        addToast('پرامپت کپی شد');
      } catch {
        addToast('کپی در مرورگر ممکن نشد', 'error');
      }
    },
    [addToast],
  );

  const onDownload = useCallback(
    async (item: GenItem) => {
      try {
        await downloadImage(item);
        addToast('دانلود شروع شد');
      } catch {
        window.open(item.url, '_blank', 'noopener');
        addToast('تصویر در تب جدید باز شد', 'warn');
      }
    },
    [addToast],
  );

  /* ---------- پیشنهادها ---------- */
  const onSuggestion = useCallback(
    (s: Surprise) => {
      setPrompt(s.en);
      textareaRef.current?.focus();
      addToast(`ایدهٔ «${s.fa}» آماده است — بساز!`);
    },
    [addToast],
  );

  const onSurprise = useCallback(() => {
    const s = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    onSuggestion(s);
  }, [onSuggestion]);

  /* ---------- گالری ---------- */
  const onDeleteHistory = useCallback((id: string) => {
    setHistory((h) => h.filter((x) => x.id !== id));
  }, []);

  const onClearHistory = useCallback(() => {
    setHistory([]);
    addToast('گالری پاک شد', 'warn');
  }, [addToast]);

  const avg = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000)
    : null;

  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-ink-950 font-sans text-paper">
      <BackgroundFX />

      <div className="relative z-10">
        <Header total={total} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* ---------- سرصفحه ---------- */}
          <section className="flex flex-col justify-between gap-10 pb-10 pt-12 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] text-brand">
                <span className="h-px w-10 bg-brand/60" />
                استودیو تصویرسازی با هوش مصنوعی
              </p>
              <h1 className="font-display text-[42px] leading-[1.2] sm:text-6xl sm:leading-[1.15] xl:text-7xl">
                آنچه در{' '}
                <span className="relative inline-block text-brand">
                  خیال
                  <IconSparkle className="animate-twinkle absolute -end-6 -top-3 h-6 w-6" />
                </span>{' '}
                داری،
                <br />
                همین‌جا تصویر می‌شود
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-8 text-muted sm:text-base sm:leading-9">
                توصیفی بنویس، سبک و ابعاد را انتخاب کن؛ مدل{' '}
                <b className="font-bold text-paper">Flux</b> در چند ثانیه آن را روی
                بوم می‌آورد. رایگان، بدون ثبت‌نام، مستقیم از مرورگر.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Stat value={faDigits(total)} label="تصویر ساخته‌شده" />
              <Stat value={avg !== null ? faDigits(avg) : '—'} label="میانگین رندر · ثانیه" />
              <Stat value={faDigits(STYLES.length - 1)} label="سبک آماده" />
            </div>
          </section>

          {/* ---------- فضای کار ---------- */}
          <section className="grid gap-6 pb-16 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
            <ControlPanel
              prompt={prompt}
              setPrompt={setPrompt}
              styleId={styleId}
              setStyleId={setStyleId}
              ratioId={ratioId}
              setRatioId={setRatioId}
              modelId={modelId}
              setModelId={setModelId}
              count={count}
              setCount={setCount}
              seed={seed}
              setSeed={setSeed}
              generating={generating}
              onGenerate={() => handleGenerate()}
              onSurprise={onSurprise}
              textareaRef={textareaRef}
            />

            <CanvasArea
              items={items}
              onDone={onDone}
              onError={onErrorItem}
              onTimeout={onTimeout}
              onRetry={onRetry}
              onOpen={setLightbox}
              onRegenerate={onRegenerate}
              onCopy={onCopy}
              onDownload={onDownload}
              onSuggestion={onSuggestion}
            />
          </section>

          {/* ---------- گالری ---------- */}
          <HistorySection
            history={history}
            onOpen={setLightbox}
            onDelete={onDeleteHistory}
            onClear={onClearHistory}
          />
        </main>

        {/* ---------- پانوشت ---------- */}
        <footer>
          <div className="film-strip h-8" aria-hidden="true" />
          <div className="border-t border-ink-700 bg-ink-900/60">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
              <p>
                تصویرها با مدل‌های <span className="font-bold text-brand">Flux</span> و{' '}
                <span className="font-bold text-brand">Turbo</span> از سرویس Pollinations.ai
                تولید می‌شوند.
              </p>
              <p className="flex items-center gap-1.5">
                ساخته‌شده برای خیال‌پردازان
                <IconSparkle className="h-3.5 w-3.5 text-brand" />
              </p>
            </div>
          </div>
        </footer>
      </div>

      <Lightbox
        item={lightbox}
        onClose={() => setLightbox(null)}
        onDownload={onDownload}
        onCopy={onCopy}
        onRegenerate={onRegenerate}
      />
      <Toasts toasts={toasts} />
    </div>
  );
}

/* ---------- آمار ---------- */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="notch-sm min-w-[128px] flex-1 border border-ink-700 bg-ink-900/80 px-4 py-3.5 text-center transition-colors duration-300 hover:border-brand/40 sm:flex-none">
      <div className="font-display text-3xl leading-none text-brand">{value}</div>
      <div className="mt-2 text-[10px] font-medium tracking-wider text-muted">{label}</div>
    </div>
  );
}

/* ---------- پس‌زمینه محیطی ---------- */
function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,163,60,0.09),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(67,214,181,0.07),transparent_50%)]" />
      <div className="glow-a absolute -start-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand/[0.07] blur-3xl" />
      <div className="glow-b absolute -bottom-40 -end-32 h-[520px] w-[520px] rounded-full bg-mint/[0.06] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(236,233,225,0.05)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
