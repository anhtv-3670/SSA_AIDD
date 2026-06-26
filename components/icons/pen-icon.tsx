// Shared pencil glyph — 24×24, dark fill (rgba(0,16,26,1)).
// Used by the FAB pill toggle and the speed-dial "Viết KUDOS" button (DRY).

interface PenIconProps {
  /** Extra inline style (e.g. flexShrink) merged onto the svg. */
  style?: React.CSSProperties;
}

export function PenIcon({ style }: PenIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill="rgba(0, 16, 26, 1)"
      />
    </svg>
  );
}
