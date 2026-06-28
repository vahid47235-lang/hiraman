import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContent } from '@/data/content'
import { formatPrice } from '@/lib/utils'
import { BedDouble, Users, Waves, Check, ArrowRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const content = await getContent()
  const unit = content.accommodations.find((u) => u.slug === slug)
  if (!unit) return {}
  return { title: `${locale === 'fa' ? unit.nameFa : unit.nameEn} — لوتکا` }
}

export default async function AccommodationDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const isFa = locale === 'fa'
  const content = await getContent()
  const unit = content.accommodations.find((u) => u.slug === slug)

  if (!unit) notFound()

  const name = isFa ? unit.nameFa : unit.nameEn
  const category = isFa ? unit.categoryFa : unit.categoryEn
  const desc = isFa ? unit.descFa : unit.descEn
  const amenities = isFa ? unit.amenitiesFa : unit.amenitiesEn

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      {/* Hero Image */}
      <div className="relative h-72 md:h-[500px] bg-deep-forest pt-16">
        <Image src={unit.imageUrl} alt={name ?? ''} fill className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/60 to-transparent" />
        <div className="absolute bottom-6 container-content">
          <Link href={`/${locale}/accommodations`} className={`text-warm-ivory/70 hover:text-warm-ivory text-body-sm flex items-center gap-1 mb-3 ${isFa ? 'flex-row-reverse' : ''}`}>
            <ArrowRight size={14} className={isFa ? 'rotate-180' : ''} />
            {isFa ? 'بازگشت به اقامتگاه‌ها' : 'Back to accommodations'}
          </Link>
          <p className="eyebrow mb-2">{category}</p>
          <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>{name}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container-content">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className={`flex items-center gap-6 py-6 border-b border-white/10 mb-8 ${isFa ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 text-body text-white/55 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <BedDouble size={16} className="text-forest-moss" />
                  <span className="num" dir="ltr">{unit.bedrooms}</span>
                  <span>{isFa ? 'اتاق خواب' : 'bedrooms'}</span>
                </div>
                <div className={`flex items-center gap-2 text-body text-white/55 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <Users size={16} className="text-forest-moss" />
                  <span className="num" dir="ltr">{unit.maxGuests}</span>
                  <span>{isFa ? 'نفر' : 'guests'}</span>
                </div>
                <div className="text-body text-white/55">
                  <span className="num" dir="ltr">{unit.areaM2}</span> {isFa ? 'متر مربع' : 'm²'}
                </div>
                {unit.hasPrivatePool && (
                  <div className={`flex items-center gap-2 text-aged-brass ${isFa ? 'flex-row-reverse' : ''}`}>
                    <Waves size={16} />
                    <span className="text-body">{isFa ? unit.poolTypeFa : unit.poolTypeEn}</span>
                  </div>
                )}
              </div>

              <h2 className={`text-headline text-white mb-4 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'درباره این اقامتگاه' : 'About this accommodation'}
              </h2>
              <p className="text-body text-white/55 leading-relaxed mb-10">{desc}</p>

              <h3 className={`text-title font-medium text-white mb-5 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'امکانات' : 'Amenities'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className={`flex items-center gap-2 text-body text-white ${isFa ? 'flex-row-reverse' : ''}`}>
                    <Check size={16} className="text-forest-moss flex-shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-white/10 p-6 sticky top-24">
                <div className="text-caption text-white/55 mb-1">{isFa ? 'شروع از' : 'Starting from'}</div>
                <div className="text-headline font-semibold text-white mb-1">
                  <span className="num" dir="ltr">{formatPrice(unit.startingPriceIRR, 'IRR', locale)}</span>
                </div>
                <div className="text-caption text-white/55 mb-6">{isFa ? 'هر شب' : 'per night'}</div>

                {unit.rating && (
                  <div className={`flex items-center gap-2 mb-6 pb-6 border-b border-white/10 ${isFa ? 'flex-row-reverse' : ''}`}>
                    <span className="text-aged-brass">★</span>
                    <span className="text-body font-medium num" dir="ltr">{unit.rating.toFixed(1)}</span>
                    <span className="text-body-sm text-white/55">({unit.reviewCount} {isFa ? 'نظر' : 'reviews'})</span>
                  </div>
                )}

                <Link href={`/${locale}/reserve?unit=${unit.id}`} className="btn btn-primary w-full text-center mb-3">
                  {isFa ? 'رزرو این اقامتگاه' : 'Reserve this unit'}
                </Link>
                <Link href={`/${locale}/contact`} className="btn btn-outline-dark w-full text-center">
                  {isFa ? 'سوال دارم' : 'I have a question'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
