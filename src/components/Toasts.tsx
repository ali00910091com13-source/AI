import { IconAlert, IconCheck } from './icons';

export type Toast = {
  id: number;
  msg: string;
  kind: 'success' | 'warn' | 'error';
};

const KIND_CLASS: Record<Toast['kind'], { box: string; icon: string }> = {
  success: { box: 'border-mint/50', icon: 'text-mint' },
  warn: { box: 'border-brand/50', icon: 'text-brand' },
  error: { box: 'border-coral/50', icon: 'text-coral' },
};

export default function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 start-5 z-[60] flex w-[280px] flex-col gap-2">
      {toasts.map((t) => {
        const c = KIND_CLASS[t.kind];
        return (
          <div
            key={t.id}
            role="status"
            className={`animate-rise flex items-center gap-2.5 rounded-lg border ${c.box} bg-ink-800/95 px-3.5 py-3 text-sm text-paper shadow-xl backdrop-blur-sm`}
          >
            <span className={`shrink-0 ${c.icon}`}>
              {t.kind === 'success' ? (
                <IconCheck className="h-4 w-4" />
              ) : (
                <IconAlert className="h-4 w-4" />
              )}
            </span>
            <span className="font-medium leading-6">{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
