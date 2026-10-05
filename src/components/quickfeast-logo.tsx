interface QuickFeastLogoProps {
  className?: string;
}

/**
 * QuickFeast brand logo, recreated as scalable SVG:
 * an orange delivery cloche vehicle with motion lines over a charcoal
 * chassis, with the QUICKFEAST wordmark underneath.
 */
export function QuickFeastLogo({ className }: QuickFeastLogoProps) {
  return (
    <svg viewBox="0 0 112 64" role="img" aria-label="QuickFeast" className={className}>
      {/* Motion lines */}
      <g stroke="var(--brand-orange)" strokeWidth={3.5} strokeLinecap="round">
        <line x1={18} y1={16} x2={29} y2={16} />
        <line x1={15} y1={23} x2={30} y2={23} />
        <line x1={18} y1={30} x2={29} y2={30} />
      </g>
      {/* Cloche dome and knob */}
      <circle cx={70} cy={11} r={2.75} fill="var(--brand-orange)" />
      <path d="M57 26 a13 13 0 0 1 26 0 Z" fill="var(--brand-orange)" />
      {/* Tray the cloche sits on */}
      <rect x={55} y={26} width={30} height={4} rx={2} fill="var(--brand-orange)" />
      {/* Rounded chassis */}
      <rect x={48} y={30} width={44} height={14} rx={7} fill="var(--foreground)" />
      {/* Wheels */}
      <circle cx={58} cy={46} r={6} fill="var(--foreground)" />
      <circle cx={82} cy={46} r={6} fill="var(--foreground)" />
      <circle cx={58} cy={46} r={2.5} fill="var(--background)" />
      <circle cx={82} cy={46} r={2.5} fill="var(--background)" />
      {/* Wordmark */}
      <text
        x={56}
        y={61}
        textAnchor="middle"
        textLength={100}
        lengthAdjust="spacingAndGlyphs"
        fontFamily="'Manrope', ui-sans-serif, system-ui, sans-serif"
        fontWeight={800}
        fontSize={12.5}
      >
        <tspan fill="var(--foreground)">QUICK</tspan>
        <tspan fill="var(--brand-orange)">FEAST</tspan>
      </text>
    </svg>
  );
}
