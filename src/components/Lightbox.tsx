import { useEffect } from 'react';
import type { GenItem } from '../lib/data';
import { MODELS, faDigits, ratioById, styleById } from '../lib/data';
import { IconClose, IconCopy, IconDownload, IconRefresh, IconWand } from './icons';

type Props = {
  item: GenItem | null;
  onClose: () => void;
  onDownload: (item: GenItem) => void;
  onCopy: (item: GenItem) => void;
  onRegenerate: (item: GenItem) => void;
};

export default function Lightbox({ item, onClose, onDownload, onCopy, onRegenerate }: Props) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const style = styleById(item.styleId);
  const ratio = ratioById(item.ratioId);
  const model = MODELS.find((m) => m.id === item.modelId);

  const metas: [string, string][] = [
    ['مدل', model?.label ?? '—'],
    ['سبک', style?.label ?? 'آزاد'],
    ['ابعاد', `${faDigits(ratio?.w ?? item.w)}×${faDigits(ratio?.h ?? item.h)}`],
    ['بذر', faDigits(item.seed)],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="پیش‌نمایش تصویر"
    >
      <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-sm" onClick={onClose} />

      <div className="animate-pop relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-ink-600 bg-ink-900 shadow-2xl lg:flex-row">
        <div className="relative grid min-h-[280px] flex-1 place-items-center bg-ink-950 p-3">
          <img
            src={item.url}
            alt={item.userPrompt}
            className="max-h-[48vh] w-auto max-w-full rounded-lg object-contain lg:max-h-[80vh]"
          />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-ink-700 p-5 lg:w-80 lg:border-s lg:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl text-paper">جزئیات تصویر</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-ink-600 text-muted transition hover:border-coral/60 hover:text-coral active:scale-90"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-bold tracking-[0.16em] text-muted">
              توصیف شما
            </div>
            <p
              dir="auto"
              className="max-h-24 overflow-y-auto rounded-lg border border-ink-600 bg-ink-950/70 p-3 text-xs leading-6 text-paper/85"
            >
              {item.userPrompt}
            </p>
          </div>

          {item.prompt !== item.userPrompt && (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-brand">
                <IconWand className="h-3.5 w-3.5" />
                پرامپت بهینه‌شده برای مدل
              </div>
              <p
                dir="ltr"
                className="max-h-28 overflow-y-auto rounded-lg border border-brand/25 bg-brand/[0.05] p-3 text-left text-xs leading-6 text-paper/85"
              >
                {item.prompt}
              </p>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-2 text-xs">
            {metas.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2">
                <dt className="text-[10px] text-muted">{k}</dt>
                <dd className="mt-0.5 font-bold text-paper">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto grid gap-2 pt-2">
            <button
              type="button"
              onClick={() => onDownload(item)}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-bold text-ink-950 transition hover:bg-brand-soft active:scale-[0.97]"
            >
              <IconDownload className="h-4 w-4" />
              دانلود تصویر
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCopy(item)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-ink-600 py-2.5 text-xs font-bold text-paper/85 transition hover:border-brand/60 hover:text-brand active:scale-[0.97]"
              >
                <IconCopy className="h-4 w-4" />
                کپی پرامپت
              </button>
              <button
                type="button"
                onClick={() => onRegenerate(item)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-ink-600 py-2.5 text-xs font-bold text-paper/85 transition hover:border-mint/60 hover:text-mint active:scale-[0.97]"
              >
                <IconRefresh className="h-4 w-4" />
                نسخهٔ تازه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
