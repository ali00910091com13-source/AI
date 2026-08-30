import type { ReactNode, SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconSparkle = (p: P) => (
  <Base {...p}>
    <path d="M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3z" />
    <path d="M18.7 15.4l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1z" />
  </Base>
);

export const IconAperture = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
    <line x1="9.69" y1="8" x2="21.17" y2="8" />
    <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
    <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
    <line x1="14.31" y1="16" x2="2.83" y2="16" />
    <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
  </Base>
);

export const IconDice = (p: P) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.2" cy="8.2" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="15.8" cy="8.2" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="8.2" cy="15.8" r="1.15" fill="currentColor" stroke="none" />
    <circle cx="15.8" cy="15.8" r="1.15" fill="currentColor" stroke="none" />
  </Base>
);

export const IconDownload = (p: P) => (
  <Base {...p}>
    <path d="M12 3v10m0 0l-4-4m4 4l4-4" />
    <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </Base>
);

export const IconCopy = (p: P) => (
  <Base {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 012-2h10" />
  </Base>
);

export const IconExpand = (p: P) => (
  <Base {...p}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </Base>
);

export const IconRefresh = (p: P) => (
  <Base {...p}>
    <path d="M21 4v6h-6" />
    <path d="M20.5 15a9 9 0 11-2.1-9.4L21 10" />
  </Base>
);

export const IconTrash = (p: P) => (
  <Base {...p}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <path d="M19 6l-.8 13.2a2 2 0 01-2 1.8H7.8a2 2 0 01-2-1.8L5 6" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Base>
);

export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Base>
);

export const IconAlert = (p: P) => (
  <Base {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Base>
);

export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Base>
);

export const IconImage = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="10" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </Base>
);

export const IconBolt = (p: P) => (
  <Base {...p}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Base>
);

export const IconLayers = (p: P) => (
  <Base {...p}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 12l10 5 10-5" />
    <path d="M2 17l10 5 10-5" />
  </Base>
);

export const IconWand = (p: P) => (
  <Base {...p}>
    <path d="M21.5 11.1l-8.6 8.6a2.1 2.1 0 01-3-3l8.6-8.6a2.1 2.1 0 013 3z" />
    <path d="M15 4V2M15 10V8M11.5 5.5h-2M20.5 5.5h-2M18 3l-1 1M18 8l-1-1" />
    <path d="M3 21l8.5-8.5" />
  </Base>
);

export const IconFilm = (p: P) => (
  <Base {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5" />
  </Base>
);
