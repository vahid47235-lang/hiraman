import Link from 'next/link'
import { Phone, MessageCircle, Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import HirabanLogo from '@/components/ui/HirabanLogo'

type Props = { locale: string }

export default function Footer({ locale }: Props) {
  const t = useTranslations('footer')
  const isFa = locale === 'fa'
  const lp = (href: string) => `/${locale}${href}`

  const links = {
    accommodation: [
      { label: isFa ? 'کلبه‌های 63 متری' : 'Forest Cabins 63m²', href: '/accommodations?type=cabin-63' },
      { label: isFa ? 'کلبه‌های 75 متری' : 'Forest Cabins 75m²', href: '/accommodations?type=cabin-75' },
      { label: isFa ? 'ویلاهای 128 متری' : 'Villas 128m²', href: '/accommodations?type=villa-128' },
      { label: isFa ? 'ویلاهای 145 متری' : 'Villas 145m²', href: '/accommodations?type=villa-145' },
      { label: isFa ? 'با استخر اختصاصی' : 'Private pool units', href: '/accommodations?pool=1' },
    ],
    experiences: [
      { label: isFa ? 'سلامت و ماساژ' : 'Wellness & massage', href: '/wellness' },
      { label: isFa ? 'یوگا' : 'Yoga', href: '/wellness#yoga' },
      { label: isFa ? 'اسب‌سواری' : 'Horse riding', href: '/adventure#horse' },
      { label: isFa ? 'ATV' : 'ATV', href: '/adventure#atv' },
      { label: isFa ? 'خانواده و کودکان' : 'Family & children', href: '/family' },
      { label: isFa ? 'رستوران' : 'Restaurant', href: '/restaurant' },
    ],
    legal: [
      { label: t('privacy'), href: '/legal/privacy' },
      { label: t('terms'), href: '/legal/terms' },
      { label: t('cancellation'), href: '/legal/cancellation' },
      { label: t('cookies'), href: '/legal/cookies' },
      { label: t('accessibility'), href: '/legal/accessibility' },
    ],
  }

  return (
    <footer role="contentinfo" className="bg-deep-forest text-warm-ivory">
      <div className="container-content">
        {/* Main footer */}
        <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-b border-hiraban-pine', isFa && 'text-end')}>
          {/* Brand column */}
          <div className={cn('col-span-2 md:col-span-1', isFa && 'order-last')}>
            <HirabanLogo locale={locale} variant="light" className="h-10 mb-4" />
            <p className="text-body-sm text-warm-ivory/60 mb-6 leading-relaxed">
              {t('tagline')}
            </p>
            {/* Social */}
            <div className={cn('flex gap-3', isFa && 'flex-row-reverse')}>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 border border-hiraban-pine rounded flex items-center justify-center text-warm-ivory/50 hover:text-aged-brass hover:border-aged-brass/40 transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Accommodations */}
          <div>
            <h3 className="text-caption font-semibold text-warm-ivory mb-4 tracking-wider uppercase">
              {isFa ? 'اقامتگاه‌ها' : 'Accommodations'}
            </h3>
            <ul className="space-y-2.5">
              {links.accommodation.map((l) => (
                <li key={l.href}>
                  <Link href={lp(l.href)} className="text-body-sm text-warm-ivory/60 hover:text-aged-brass transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="text-caption font-semibold text-warm-ivory mb-4 tracking-wider uppercase">
              {isFa ? 'تجربه‌ها' : 'Experiences'}
            </h3>
            <ul className="space-y-2.5">
              {links.experiences.map((l) => (
                <li key={l.href}>
                  <Link href={lp(l.href)} className="text-body-sm text-warm-ivory/60 hover:text-aged-brass transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-caption font-semibold text-warm-ivory mb-4 tracking-wider uppercase">
              {isFa ? 'تماس' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+989125584407"
                  className={cn('flex items-center gap-2 text-body-sm text-warm-ivory/60 hover:text-aged-brass transition-colors', isFa && 'flex-row-reverse')}
                  dir="ltr"
                >
                  <Phone size={14} />
                  <span className="num" dir="ltr">+98 912 558 4407</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/989125584407"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('flex items-center gap-2 text-body-sm text-warm-ivory/60 hover:text-aged-brass transition-colors', isFa && 'flex-row-reverse')}
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-6', isFa && 'sm:flex-row-reverse')}>
          <p className="text-caption text-warm-ivory/40">
            <span className="num" dir="ltr">©</span>
            {' '}
            <span className="num" dir="ltr">2025</span>
            {' '}HIRABAN هیرابان. {t('copyright')}.
          </p>
          <nav aria-label={isFa ? 'لینک‌های قانونی' : 'Legal links'}>
            <ul className={cn('flex flex-wrap gap-4', isFa && 'flex-row-reverse')}>
              {links.legal.map((l) => (
                <li key={l.href}>
                  <Link href={lp(l.href)} className="text-caption text-warm-ivory/40 hover:text-aged-brass transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
