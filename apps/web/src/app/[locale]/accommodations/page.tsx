import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/data/content'
import AccommodationCard from '@/components/accommodation/AccommodationCard'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: locale === 'fa' ? 'اقامتگاه‌ها — هیرابان' : 'Accommodations — Hiraban',
  }
}

export default async function AccommodationsPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const content = await getContent()

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      {/* Hero */}
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image
          src="https://picsum.photos/seed/accommodations-hero/1920/600"
          alt={isFa ? 'اقامتگاه‌های هیرابان' : 'Hiraban Accommodations'}
          fill className="object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'اقامتگاه‌ها' : 'Accommodations'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'کلبه‌ها و ویلاهای ما' : 'Our Cabins & Villas'}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-warm-ivory">
        <div className="container-content">
          <p className="text-body text-warm-gray mb-10 max-w-2xl">
            {isFa
              ? 'هر واحد اقامتی هیرابان با دقت طراحی شده تا بهترین تجربه اقامتی در دل طبیعت را برای شما فراهم کند.'
              : 'Each Hiraban unit is carefully designed to give you the finest nature retreat experience.'}
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
