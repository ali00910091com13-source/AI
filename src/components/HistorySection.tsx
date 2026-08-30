import { useState } from 'react';
import type { GenItem } from '../lib/data';
import { faDigits } from '../lib/data';
import { useReveal } from '../hooks/useReveal';
import { IconFilm, IconTrash } from './icons';

type Props = {
  history: GenItem[];
  onOpen: (item: GenItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export default function HistorySection({ history, onOpen, onDelete, onClear }: Props) {
  const ref = useReveal<HTMLElement>();
  const [confirming, setConfirming] = useState(false);

  return (
    <section ref={ref} className="reveal pb-20">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-2xl text-paper">
          <span className="notch-sm grid h-9 w-9 place-items-center bg-mint/15 text-mint">
            <IconFilm className="h-5 w-5" />
          </span>
          گالری شما
          <span className="self-center text-sm font-normal text-muted">
            ({faDigits(history.length)} اثر)
          </span>
        </h2>

        {history.length > 0 &&
          (confirming ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">همه پاک شوند؟</span>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setConfirming(false);
                }}
                className="rounded-md border border-coral/40 bg-coral/15 px-3 py-1.5 font-bold text-coral transition hover:bg-coral/25 active:scale-95"
              >
                بله، پاک کن
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md border border-ink-600 px-3 py-1.5 text-paper/70 transition hover:bg-ink-800 active:scale-95"
              >
                نه
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex items-center gap-1.5 rounded-md border border-ink-600 px-3 py-1.5 text-xs text-muted transition hover:border-coral/50 hover:text-coral active:scale-95"
            >
              <IconTrash className="h-3.5 w-3.5" />
              پاک‌کردن همه
            </button>
          ))}
      </div>

      {history.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ink-600 bg-ink-900/40 px-5 py-9 text-center text-sm leading-7 text-muted">
          تصویرهایی که می‌سازی همین‌جا ذخیره می‌شوند — حتی بعد از بستن مرورگر.
        </p>
      ) : (
        <div className="scroll-thin -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
          {history.map((h) => (
            <figure
              key={h.id}
              className="group relative w-40 shrink-0 snap-start overflow-hidden rounded-lg border border-ink-700 bg-ink-900 transition-colors duration-300 hover:border-brand/50"
            >
              <button
                type="button"
                onClick={() => onOpen(h)}
                className="block aspect-square w-full"
                title="نمایش بزرگ"
              >
                <img
                  src={h.url}
                  alt={h.userPrompt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
              <figcaption
                dir="ltr"
                className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-transparent px-2.5 pb-1.5 pt-7 text-left text-[10px] text-paper/85"
              >
                {h.userPrompt}
              </figcaption>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(h.id);
                }}
                title="حذف از گالری"
                aria-label="حذف از گالری"
                className="absolute end-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-ink-950/75 text-paper/70 opacity-0 transition-all duration-200 hover:bg-coral hover:text-ink-950 group-hover:opacity-100"
              >
                <IconTrash className="h-3.5 w-3.5" />
              </button>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
