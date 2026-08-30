import { faDigits } from '../lib/data';
import { IconAperture, IconImage } from './icons';

export default function Header({ total }: { total: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="notch-sm grid h-10 w-10 place-items-center bg-brand text-ink-950">
            <IconAperture className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <div className="font-display text-2xl leading-none text-paper">
              خیال‌نگار
            </div>
            <div className="mt-1 text-[9px] font-medium tracking-[0.32em] text-muted">
              KHAYAL NEGAR · AI STUDIO
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-ink-600 bg-ink-900 px-3.5 py-1.5 text-xs text-muted sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            مدل Flux · آنلاین
          </div>
          <div
            className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-bold text-brand"
            title="مجموع تصویرهای ساخته‌شده"
          >
            <IconImage className="h-4 w-4" />
            {faDigits(total)} تصویر
          </div>
        </div>
      </div>
    </header>
  );
}
