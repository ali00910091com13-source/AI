import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { GenItem, Surprise } from '../lib/data';
import { SURPRISES, faDigits, styleById } from '../lib/data';
import {
  IconAlert,
  IconAperture,
  IconCopy,
  IconDownload,
  IconExpand,
  IconLayers,
  IconRefresh,
  IconSparkle,
} from './icons';

type Props = {
  items: GenItem[];
  onDone: (id: string, durationMs: number) => void;
  onError: (id: string) => void;
  onTimeout: (id: string) => void;
  onRetry: (id: string) => void;
  onOpen: (item: GenItem) => void;
  onRegenerate: (item: GenItem) => void;
  onCopy: (item: GenItem) => void;
  onDownload: (item: GenItem) => void;
  onSuggestion: (s: Surprise) => void;
};

type CardProps = {
  item: GenItem;
  index: number;
  onDone: Props['onDone'];
  onError: Props['onError'];
  onTimeout: Props['onTimeout'];
  onRetry: Props['onRetry'];
  onOpen: Props['onOpen'];
  onRegenerate: Props['onRegenerate'];
  onCopy: Props['onCopy'];
  onDownload: Props['onDownload'];
};

export default function CanvasArea({
  items,
  onDone,
  onError,
  onTimeout,
  onRetry,
  onOpen,
  onRegenerate,
  onCopy,
  onDownload,
  onSuggestion,
}: Props) {
  const first = items[0];
  const cols = !first
    ? 'grid-cols-1'
    : first.h > first.w
      ? 'grid-cols-2 lg:grid-cols-3'
      : first.w / first.h >= 1.6
        ? 'grid-cols-1'
        : 'grid-cols-1 lg:grid-cols-2';

  return (
    <div className="min-w-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-2xl text-paper">
          <span className="notch-sm grid h-9 w-9 place-items-center bg-brand/15 text-brand">
            <IconLayers className="h-5 w-5" />
          </span>
          بومِ نتیجه
        </h2>
        {first && (
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <span className="rounded-full border border-ink-600 bg-ink-900 px-2.5 py-1">
              {styleById(first.styleId)?.label ?? 'آزاد'}
            </span>
            <span className="rounded-full border border-ink-600 bg-ink-900 px-2.5 py-1">
              {faDigits(first.w)}×{faDigits(first.h)}
            </span>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 font-bold text-brand">
              {faDigits(items.length)} تصویر در این نوبت
            </span>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCanvas onSuggestion={onSuggestion} />
      ) : (
        <div className={`grid ${cols} gap-4`}>
          {items.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              index={i}
              onDone={onDone}
              onError={onError}
              onTimeout={onTimeout}
              onRetry={onRetry}
              onOpen={onOpen}
              onRegenerate={onRegenerate}
              onCopy={onCopy}
              onDownload={onDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- کارت تصویر ---------------- */

function ItemCard({
  item,
  index,
  onDone,
  onError,
  onTimeout,
  onRetry,
  onOpen,
  onRegenerate,
  onCopy,
  onDownload,
}: CardProps) {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    if (item.status !== 'loading') return;
    setSec(0);
    const t0 = Date.now();
    const iv = window.setInterval(
      () => setSec(Math.floor((Date.now() - t0) / 1000)),
      1000,
    );
    const to = window.setTimeout(() => onTimeout(item.id), 110_000);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(to);
    };
  }, [item.status, item.attempt, item.id, onTimeout]);

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-ink-700 bg-ink-900 transition-all duration-300 hover:border-brand/40 hover:shadow-[0_24px_70px_-24px_rgba(242,163,60,0.3)]"
      style={{ aspectRatio: `${item.w} / ${item.h}` }}
    >
      {item.status !== 'error' && (
        <img
          key={`${item.id}-${item.attempt}`}
          src={item.url}
          alt={item.userPrompt}
          onLoad={() => {
            if (item.status === 'loading') onDone(item.id, Date.now() - item.startedAt);
          }}
          onError={() => {
            if (item.status === 'loading') onError(item.id);
          }}
          onClick={() => {
            if (item.status === 'done') onOpen(item);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            item.status === 'done' ? 'cursor-zoom-in opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {item.status === 'loading' && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(110deg,#141722_40%,#1e2434_50%,#141722_60%)] bg-[length:250%_100%]" />
          <div className="animate-scan absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-brand/15 to-transparent blur-md" />
          <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <IconAperture className="animate-spin-slower h-10 w-10 text-brand/80" />
            <div className="font-display text-lg text-paper">در حال رندر…</div>
            <div className="rounded-full border border-ink-600 bg-ink-950/80 px-3 py-1 text-xs font-bold text-brand">
              {faDigits(sec)} ثانیه
            </div>
            <p dir="ltr" className="line-clamp-2 max-w-[90%] text-[11px] leading-5 text-muted">
              {item.userPrompt}
            </p>
          </div>
        </div>
      )}

      {item.status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ink-900 p-5 text-center">
          <IconAlert className="h-9 w-9 text-coral" />
          <div className="font-display text-lg text-paper">تولید ناموفق بود</div>
          <p className="text-[11px] leading-5 text-muted">
            شاید سرور شلوغ است؛ یک بار دیگر تلاش کن.
          </p>
          <button
            type="button"
            onClick={() => onRetry(item.id)}
            className="mt-1 flex items-center gap-2 rounded-lg border border-coral/50 bg-coral/10 px-4 py-2 text-sm font-bold text-coral transition hover:bg-coral/20 active:scale-95"
          >
            <IconRefresh className="h-4 w-4" />
            تلاش دوباره
          </button>
        </div>
      )}

      {item.status === 'done' && (
        <>
          <div className="pointer-events-none absolute start-2.5 top-2.5 z-20 rounded-md bg-ink-950/70 px-2 py-0.5 font-display text-base leading-6 text-brand">
            {faDigits(index + 1)}
          </div>
          <div className="pointer-events-none absolute bottom-2.5 start-2.5 z-20 rounded-md bg-ink-950/70 px-2 py-1 text-[10px] text-paper/80">
            بذر {faDigits(item.seed)}
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-ink-950/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ActionBtn title="بزرگ‌نمایی" onClick={() => onOpen(item)}>
              <IconExpand className="h-5 w-5" />
            </ActionBtn>
            <ActionBtn title="دانلود تصویر" onClick={() => onDownload(item)}>
              <IconDownload className="h-5 w-5" />
            </ActionBtn>
            <ActionBtn title="کپی پرامپت" onClick={() => onCopy(item)}>
              <IconCopy className="h-5 w-5" />
            </ActionBtn>
            <ActionBtn title="نسخهٔ تازه با بذر جدید" onClick={() => onRegenerate(item)}>
              <IconRefresh className="h-5 w-5" />
            </ActionBtn>
          </div>
        </>
      )}
    </div>
  );
}

function ActionBtn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-lg border border-paper/20 bg-paper/10 text-paper transition-all duration-200 hover:border-brand hover:bg-brand hover:text-ink-950 active:scale-90"
    >
      {children}
    </button>
  );
}

/* ---------------- حالت خالی ---------------- */

function EmptyCanvas({ onSuggestion }: { onSuggestion: (s: Surprise) => void }) {
  return (
    <div className="notch relative grid min-h-[440px] place-items-center overflow-hidden border border-dashed border-ink-600 bg-ink-900/50">
      <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-mint/5 blur-3xl" />
      <div className="relative flex max-w-md flex-col items-center gap-6 p-8 text-center">
        <div className="relative">
          <IconAperture className="animate-spin-slower h-20 w-20 text-ink-600" />
          <IconSparkle className="animate-twinkle absolute -end-2 -top-1 h-7 w-7 text-brand" />
        </div>
        <div>
          <h3 className="font-display text-3xl text-paper">بوم خالی است</h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            توصیفی در کنسول بنویس و دکمهٔ «ساخت تصویر» را بزن؛ یا یکی از این
            ایده‌ها را همین‌جا امتحان کن:
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SURPRISES.slice(0, 4).map((s) => (
            <button
              key={s.fa}
              type="button"
              onClick={() => onSuggestion(s)}
              className="flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-950/60 px-3.5 py-1.5 text-xs text-paper/80 transition hover:border-brand/60 hover:text-brand active:scale-95"
            >
              <IconSparkle className="h-3.5 w-3.5 text-brand" />
              {s.fa}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
