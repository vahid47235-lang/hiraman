import { cn } from '@/lib/utils'

type Props = { locale: string }

const services = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M20 4C14 4 8 10 8 18c0 5 3 9 7 11v3h10v-3c4-2 7-6 7-11 0-8-6-14-12-14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 32h12M16 35h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titleEn: 'Private Pool Suites',
    titleFa: 'کلبه با استخر اختصاصی',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M28 22l4 4M12 22l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titleEn: 'Wellness & Spa',
    titleFa: 'سلامتی و اسپا',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M6 30c4-8 10-14 14-14s10 6 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 16V8M16 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 30c2-4 5-7 10-7s8 3 10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    titleEn: 'Nature Trails',
    titleFa: 'طبیعت‌گردی',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <rect x="6" y="18" width="28" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 18v-4a8 8 0 0116 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="26" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    titleEn: 'Yoga & Meditation',
    titleFa: 'یوگا و مدیتیشن',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M8 28c3-6 6-12 12-12s9 6 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 22c2-3 3-6 6-6s4 3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    titleEn: 'Horse Riding',
    titleFa: 'اسب‌سواری',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M6 20h28M20 6v28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    titleEn: 'ATV Adventure',
    titleFa: 'ماجراجویی با ATV',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M8 30V14l12-8 12 8v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 30v-8h10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    titleEn: 'Fine Dining',
    titleFa: 'رستوران لوکس',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M10 20c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 22h28M20 30v4M14 34h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    titleEn: 'Children\'s Garden',
    titleFa: 'باغ کودکان',
  },
]

export default function ServicesSection({ locale }: Props) {
  const isFa = locale === 'fa'

  return (
    <section className="section bg-warm-ivory">
      <div className="container-content">
        <div className={cn('text-center mb-12', isFa && 'font-persian-display')}>
          <p className="eyebrow mb-4">{isFa ? 'خدمات' : 'Services'}</p>
          <h2 className={cn('text-headline text-charcoal', isFa ? 'font-persian-display' : 'font-display')}>
            {isFa ? 'تجربه‌ای کامل از لوکس' : 'A complete luxury experience'}
          </h2>
          <p className="text-body text-warm-gray mt-4 max-w-2xl mx-auto">
            {isFa
              ? 'هیرابان هر آنچه برای یک اقامت بی‌نظیر نیاز دارید را فراهم کرده است.'
              : 'Hiraban offers everything you need for an unforgettable luxury retreat in nature.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-stone">
          {services.map((service) => (
            <div
              key={service.titleEn}
              className={cn(
                'flex flex-col items-center gap-3 p-8 bg-warm-ivory hover:bg-white transition-colors duration-200 group',
                isFa && 'text-center',
              )}
            >
              <div className="text-forest-moss group-hover:text-hiraban-pine transition-colors duration-200">
                {service.icon}
              </div>
              <span className={cn(
                'text-body-sm font-medium text-charcoal text-center',
                isFa ? 'font-persian-sans' : '',
              )}>
                {isFa ? service.titleFa : service.titleEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
