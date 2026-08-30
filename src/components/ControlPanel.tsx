import type { ReactNode, RefObject } from 'react';
import type { CSSProperties } from 'react';
import { COUNTS, MODELS, RATIOS, STYLES, faDigits, randomSeed } from '../lib/data';
import {
  IconAperture,
  IconBolt,
  IconDice,
  IconImage,
  IconLayers,
  IconSparkle,
  IconWand,
} from './icons';

type Props = {
  prompt: string;
  setPrompt: (v: string) => void;
  styleId: string;
  setStyleId: (v: string) => void;
  ratioId: string;
  setRatioId: (v: string) => void;
  modelId: string;
  setModelId: (v: string) => void;
  count: number;
  setCount: (v: number) => void;
  seed: string;
  setSeed: (v: string) => void;
  enhance: boolean;
  setEnhance: (v: boolean) => void;
  enhancing: boolean;
  generating: boolean;
  onGenerate: () => void;
  onSurprise: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
};

const GLYPHS: Record<string, [number, number]> = {
  sq: [15, 15],
  p43: [18, 14],
  p34: [13, 17],
  w16: [20, 12],
  t916: [11, 18],
};

function Label({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-muted">
      <span className="text-brand/80">{icon}</span>
      {children}
    </div>
  );
}

export default function ControlPanel({
  prompt,
  setPrompt,
  styleId,
  setStyleId,
  ratioId,
  setRatioId,
  modelId,
  setModelId,
  count,
  setCount,
  seed,
  setSeed,
  enhance,
  setEnhance,
  enhancing,
  generating,
  onGenerate,
  onSurprise,
  textareaRef,
}: Props) {
  return (
    <aside className="notch h-fit border border-ink-700 bg-ink-900/90 lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-850 px-5 py-4">
        <h2 className="font-display text-xl text-paper">کنسول ساخت</h2>
        <IconWand className="h-5 w-5 text-brand" />
      </div>

      <div className="space-y-6 px-5 py-6">
        {/* ---- توصیف ---- */}
        <section>
          <Label icon={<IconWand className="h-3.5 w-3.5" />}>توصیف تصویر</Label>
          <textarea
            ref={textareaRef}
            rows={4}
            dir="auto"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                onGenerate();
              }
            }}
            placeholder="مثلاً: گربه‌ای فضانورد که از پنجرهٔ ایستگاه به زمین نگاه می‌کند…"
            className="w-full resize-none rounded-lg border border-ink-600 bg-ink-950/70 p-3.5 text-sm leading-7 text-paper outline-none transition placeholder:text-muted/60 focus:border-brand/70 focus:ring-2 focus:ring-brand/20"
          />
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
            <span>
              <kbd className="rounded border border-ink-600 bg-ink-800 px-1.5 py-0.5 text-[10px]">Ctrl</kbd>
              {' + '}
              <kbd className="rounded border border-ink-600 bg-ink-800 px-1.5 py-0.5 text-[10px]">Enter</kbd>
              {' '}ساخت سریع
            </span>
            <span>{faDigits(prompt.length)} نویسه</span>
          </div>
          <button
            type="button"
            onClick={onSurprise}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-brand/40 bg-brand/5 px-3 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/15 active:scale-[0.98]"
          >
            <IconDice className="h-5 w-5" />
            غافلگیرم کن
          </button>
        </section>

        {/* ---- سبک ---- */}
        <section className="border-t border-ink-700/70 pt-5">
          <Label icon={<IconSparkle className="h-3.5 w-3.5" />}>سبک تصویر</Label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => {
              const active = s.id === styleId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyleId(s.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-200 active:scale-95 ${
                    active
                      ? 'border-brand bg-brand font-bold text-ink-950 shadow-[0_4px_18px_rgba(242,163,60,0.35)]'
                      : 'border-ink-600 bg-ink-950/50 text-paper/80 hover:border-brand/50 hover:text-brand'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ---- ابعاد ---- */}
        <section className="border-t border-ink-700/70 pt-5">
          <Label icon={<IconImage className="h-3.5 w-3.5" />}>ابعاد بوم</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {RATIOS.map((r) => {
              const active = r.id === ratioId;
              const [gw, gh] = GLYPHS[r.id];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRatioId(r.id)}
                  title={`${r.w} × ${r.h}`}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border py-2.5 transition-all duration-200 active:scale-95 ${
                    active
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-ink-600 bg-ink-950/50 text-muted hover:border-ink-500 hover:text-paper'
                  }`}
                >
                  <span
                    className="block rounded-[3px] border-2 border-current"
                    style={{ width: gw, height: gh } as CSSProperties}
                  />
                  <span className="text-[10px] font-semibold">{r.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ---- مدل و تعداد ---- */}
        <section className="border-t border-ink-700/70 pt-5">
          <Label icon={<IconBolt className="h-3.5 w-3.5" />}>موتور تولید</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {MODELS.map((m) => {
              const active = m.id === modelId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModelId(m.id)}
                  className={`rounded-lg border px-3 py-2.5 text-start transition-all duration-200 active:scale-95 ${
                    active
                      ? 'border-brand bg-brand/10'
                      : 'border-ink-600 bg-ink-950/50 hover:border-ink-500'
                  }`}
                >
                  <span
                    className={`flex items-center gap-1.5 text-sm font-bold ${active ? 'text-brand' : 'text-paper'}`}
                  >
                    {m.id === 'turbo' && <IconBolt className="h-3.5 w-3.5" />}
                    {m.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-muted">{m.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <Label icon={<IconLayers className="h-3.5 w-3.5" />}>تعداد در هر نوبت</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {COUNTS.map((c) => {
                const active = c === count;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCount(c)}
                    className={`rounded-lg border py-2 text-sm transition-all duration-200 active:scale-95 ${
                      active
                        ? 'border-brand bg-brand/10 font-bold text-brand'
                        : 'border-ink-600 bg-ink-950/50 text-paper/80 hover:border-ink-500'
                    }`}
                  >
                    {faDigits(c)} تصویر
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- بذر ---- */}
        <section className="border-t border-ink-700/70 pt-5">
          <Label icon={<IconDice className="h-3.5 w-3.5" />}>بذر (Seed)</Label>
          <div className="flex gap-1.5">
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, ''))}
              inputMode="numeric"
              maxLength={10}
              dir="ltr"
              placeholder="Random"
              title="عدد بذر؛ خالی یعنی تصادفی"
              className="w-full rounded-lg border border-ink-600 bg-ink-950/70 px-3 py-2 text-left text-sm text-paper outline-none transition placeholder:text-muted/50 focus:border-brand/70 focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setSeed(String(randomSeed()))}
              title="بذر تصادفی"
              className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-950/50 text-muted transition hover:rotate-12 hover:border-brand/60 hover:text-brand active:scale-90"
            >
              <IconDice className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-[10px] leading-5 text-muted">
            بذر ثابت = تصویر تکرارپذیر؛ همان پرامپت و همان بذر، همان نتیجه.
          </p>
        </section>

        {/* ---- پرامپت‌نویس هوشمند ---- */}
        <section className="border-t border-ink-700/70 pt-5">
          <button
            type="button"
            role="switch"
            aria-checked={enhance}
            onClick={() => setEnhance(!enhance)}
            className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-start transition-colors duration-200 active:scale-[0.99] ${
              enhance
                ? 'border-brand/50 bg-brand/[0.07]'
                : 'border-ink-600 bg-ink-950/60 hover:border-ink-500'
            }`}
          >
            <span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-paper">
                <IconWand className={`h-4 w-4 ${enhance ? 'text-brand' : 'text-muted'}`} />
                پرامپت‌نویس هوشمند
              </span>
              <span className="mt-1 block text-[10px] leading-5 text-muted">
                توصیف فارسی‌ات را با هوش مصنوعی به پرامپت انگلیسیِ دقیق تبدیل می‌کند تا
                تصویر، درست همان چیزی شود که گفتی.
              </span>
            </span>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                enhance ? 'bg-brand' : 'bg-ink-600'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-md transition-all duration-300 ${
                  enhance ? 'start-[22px]' : 'start-0.5'
                }`}
              />
            </span>
          </button>
        </section>

        {/* ---- ساخت ---- */}
        <section className="border-t border-ink-700/70 pt-5">
          <button
            type="button"
            onClick={onGenerate}
            disabled={generating || !prompt.trim()}
            className="notch-sm group flex w-full items-center justify-center gap-2.5 bg-brand px-4 py-3.5 font-display text-2xl text-ink-950 transition-all duration-200 hover:bg-brand-soft hover:shadow-[0_10px_40px_-8px_rgba(242,163,60,0.55)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand disabled:hover:shadow-none"
          >
            {generating ? (
              enhancing ? (
                <>
                  <IconWand className="h-6 w-6 animate-pulse" />
                  بهینه‌سازی پرامپت…
                </>
              ) : (
                <>
                  <IconAperture className="h-6 w-6 animate-spin-slower" />
                  در حال ساخت…
                </>
              )
            ) : (
              <>
                <IconSparkle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                ساخت تصویر
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-muted">
            رایگان · بدون ثبت‌نام · قدرت‌گرفته از Pollinations
          </p>
        </section>
      </div>
    </aside>
  );
}
