import { cn } from '@/lib/utils'

type Props = { locale: string }

// CMS-managed slots — each can be hidden, linked, reordered
// Do not enable platforms that have not been verified
const PLATFORMS = [
  { key: 'booking', label: 'Booking.com', href: null, enabled: false },
  { key: 'tripadvisor', label: 'Tripadvisor', href: null, enabled: false },
  { key: 'expedia', label: 'Expedia', href: null, enabled: false },
  { key: 'agoda', label: 'Agoda', href: null, enabled: false },
  { key: 'jabama', label: 'جاباما', href: null, enabled: false },
  { key: 'jajiga', label: 'جاجیگا', href: null, enabled: false },
  { key: 'eghamat24', label: 'اقامت 24', href: null, enabled: false },
]

export default function PlatformLogos({ locale }: Props) {
  const isFa = locale === 'fa'
  const enabled = PLATFORMS.filter((p) => p.enabled)

  // Don't render section if no verified platforms
  if (enabled.length === 0) return null

  return (
    <section className="py-10 bg-white border-y border-stone">
      <div className="container-content">
        <p className={cn('text-caption text-warm-gray mb-6', isFa ? 'text-end' : '')}>
          {isFa
            ? 'هیرابان را در پلتفرم‌های گردشگری پیدا کنید'
            : 'Find Hiraban on leading travel platforms'}
        </p>
        <div className={cn('flex flex-wrap items-center gap-8', isFa && 'flex-row-reverse')}>
          {enabled.map((platform) => (
            platform.href ? (
              <a
                key={platform.key}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-body-sm font-medium text-warm-gray hover:text-charcoal transition-colors grayscale hover:grayscale-0"
                aria-label={`${isFa ? 'مشاهده هیرابان در' : 'View Hiraban on'} ${platform.label}`}
              >
                {platform.label}
              </a>
            ) : (
              <span
                key={platform.key}
                className="text-body-sm font-medium text-stone"
                aria-hidden="true"
              >
                {platform.label}
              </span>
            )
          ))}
        </div>
      </div>
    </section>
  )
}
