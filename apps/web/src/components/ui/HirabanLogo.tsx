import { cn } from '@/lib/utils'

type LogoProps = {
  locale: string
  variant?: 'light' | 'dark' | 'gold'
  className?: string
}

/**
 * HIRABAN typographic wordmark — SVG implementation of a custom-kerned
 * luxury serif logotype. No icons, trees, or symbols.
 */
export default function HirabanLogo({ locale, variant = 'dark', className }: LogoProps) {
  const isFa = locale === 'fa'

  const colors = {
    light: { primary: '#F4F0E7', accent: '#C5A66A' },
    dark: { primary: '#0B1A13', accent: '#C5A66A' },
    gold: { primary: '#C5A66A', accent: '#D7BF88' },
  }[variant]

  if (isFa) {
    return (
      <span
        className={cn('inline-flex flex-col items-center gap-0', className)}
        role="img"
        aria-label="هیرابان"
      >
        <span
          style={{
            fontFamily: "'Vazirmatn', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: colors.primary,
            lineHeight: 1.1,
            direction: 'rtl',
          }}
        >
          هیرابان
        </span>
        <span
          style={{
            display: 'block',
            width: '56px',
            height: '1px',
            background: colors.accent,
            opacity: 0.7,
            marginTop: '2px',
          }}
        />
      </span>
    )
  }

  return (
    <svg
      className={cn('overflow-visible', className)}
      viewBox="0 0 200 44"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HIRABAN"
    >
      <title>HIRABAN</title>
      {/* English wordmark — Cormorant Garamond inspired elegant serif */}
      <text
        x="100"
        y="32"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="28"
        fontWeight="500"
        fill={colors.primary}
        letterSpacing="8"
      >
        HIRABAN
      </text>
      {/* Gold underline accent */}
      <rect x="62" y="38" width="76" height="0.75" fill={colors.accent} opacity="0.7" />
    </svg>
  )
}

/** Minimal favicon H/هـ mark for small sizes */
export function HirabanMark({ variant = 'dark', className }: Omit<LogoProps, 'locale'>) {
  const colors = {
    light: '#F4F0E7',
    dark: '#0B1A13',
    gold: '#C5A66A',
  }[variant]

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="4" fill={variant === 'light' ? '#0B1A13' : '#F4F0E7'} />
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontWeight="500"
        fill={colors}
        letterSpacing="1"
      >
        H
      </text>
    </svg>
  )
}
