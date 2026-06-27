import Link from 'next/link'
import { cn } from '@/lib/utils'
import AccommodationCard, { type AccommodationUnit } from '@/components/accommodation/AccommodationCard'
import content from '@/data/content'

type Props = { locale: string }

const SAMPLE_UNITS: AccommodationUnit[] = content.accommodations

export default function AccommodationHighlights({ locale }: Props) {
  const isFa = locale === 'fa'

  return (
    <section className="section bg-warm-ivory">
      <div className="container-content">
        {/* Header */}
        <div className={cn('mb-12', isFa ? 'text-end' : '')}>
          <p className="eyebrow mb-4">{isFa ? 'اقامتگاه‌های لوتکا' : 'Where you\'ll stay'}</p>
          <div className={cn('flex items-end justify-between gap-8', isFa && 'flex-row-reverse')}>
            <div>
              <h2 className={cn('text-headline text-charcoal', isFa ? 'font-persian-display' : 'font-display')}>
                {isFa ? '17 واحد اقامتی در دل جنگل' : '17 unique forest dwellings'}
              </h2>
              <span className="divider-gold mt-4 block" />
            </div>
            <Link
              href={`/${locale}/accommodations`}
              className="btn btn-outline-dark btn-sm whitespace-nowrap hidden sm:inline-flex"
            >
              {isFa ? 'مشاهده همه' : 'View all'}
            </Link>
          </div>
        </div>

        {/* Category tabs */}
        <div className={cn('flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin', isFa && 'flex-row-reverse')}>
          {[
            { label: isFa ? 'همه' : 'All', filter: 'all' },
            { label: isFa ? 'کلبه' : 'Cabins', filter: 'cabin' },
            { label: isFa ? 'ویلا' : 'Villas', filter: 'villa' },
            { label: isFa ? 'استخر اختصاصی' : 'Private pool', filter: 'pool' },
          ].map((tab) => (
            <button
              key={tab.filter}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                tab.filter === 'all'
                  ? 'bg-lootka-pine text-warm-ivory'
                  : 'bg-white text-warm-gray border border-stone hover:border-lootka-pine hover:text-charcoal',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SAMPLE_UNITS.map((unit) => (
            <AccommodationCard key={unit.id} unit={unit} locale={locale} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href={`/${locale}/accommodations`} className="btn btn-outline-dark">
            {isFa ? 'مشاهده همه اقامتگاه‌ها' : 'View all accommodations'}
          </Link>
        </div>
      </div>
    </section>
  )
}
