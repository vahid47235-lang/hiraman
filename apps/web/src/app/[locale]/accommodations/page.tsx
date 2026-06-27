import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getContent } from '@/data/content'
import AccommodationCard from '@/components/accommodation/AccommodationCard'
import AccommodationsHero from '@/components/accommodation/AccommodationsHero'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'fa' ? 'اقامتگاه‌ها — لوتکا' : 'Accommodations — Lootka',
  }
}

export default async function AccommodationsPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const content = await getContent()

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <AccommodationsHero locale={locale} />

      {/* Content */}
      <section className="section bg-warm-ivory">
        <div className="container-content">
          <p className="text-body text-warm-gray mb-10 max-w-2xl">
            {isFa
              ? 'هر واحد اقامتی لوتکا با دقت طراحی شده تا بهترین تجربه اقامتی در دل طبیعت را برای شما فراهم کند.'
              : 'Each Lootka unit is carefully designed to give you the finest nature retreat experience.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.accommodations.map((unit) => (
              <AccommodationCard key={unit.id} unit={unit} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
