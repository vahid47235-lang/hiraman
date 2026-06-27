import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Users, Waves, Star, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { formatPrice, formatNumber } from '@/lib/utils'

export type AccommodationUnit = {
  id: string
  slug: string
  nameEn: string
  nameFa: string
  categoryEn: string
  categoryFa: string
  areaM2: number
  maxGuests: number
  bedrooms: number
  hasPrivatePool: boolean
  poolTypeEn?: string
  poolTypeFa?: string
  startingPriceIRR: number
  imageUrl: string
  imageAlt: string
  rating?: number
  reviewCount?: number
  availability: 'available' | 'limited' | 'unavailable'
  instantConfirm: boolean
  amenitiesEn: string[]
  amenitiesFa: string[]
}

type Props = {
  unit: AccommodationUnit
  locale: string
  className?: string
}

const availabilityColors = {
  available: 'text-forest-moss bg-forest-moss/10',
  limited: 'text-natural-clay bg-natural-clay/10',
  unavailable: 'text-warm-gray bg-warm-gray/10',
}

export default function AccommodationCard({ unit, locale, className }: Props) {
  const t = useTranslations('accommodation')
  const isFa = locale === 'fa'

  const name = isFa ? unit.nameFa : unit.nameEn
  const category = isFa ? unit.categoryFa : unit.categoryEn

  return (
    <article
      className={cn('card group', className)}
      aria-label={name}
    >
      {/* Image */}
      <div className="relative aspect-accommodation overflow-hidden">
        <Image
          src={unit.imageUrl}
          alt={unit.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {unit.hasPrivatePool && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-deep-forest/80 backdrop-blur-sm text-aged-brass text-caption rounded-full border border-aged-brass/30">
              <Waves size={11} />
              {isFa ? unit.poolTypeFa || 'استخر اختصاصی' : unit.poolTypeEn || 'Private pool'}
            </span>
          )}
          {unit.instantConfirm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-lootka-pine/80 backdrop-blur-sm text-warm-ivory text-caption rounded-full">
              <Check size={11} />
              {t('instant_confirm')}
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="absolute top-3 end-3">
          <span className={cn('px-2.5 py-1 text-caption rounded-full font-medium', availabilityColors[unit.availability])}>
            {t(unit.availability)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category + Rating */}
        <div className={cn('flex items-center justify-between mb-2', isFa && 'flex-row-reverse')}>
          <span className="eyebrow">{category}</span>
          {unit.rating && (
            <div className={cn('flex items-center gap-1', isFa && 'flex-row-reverse')}>
              <Star size={13} className="text-aged-brass fill-aged-brass" />
              <span className="num text-body-sm font-medium text-charcoal" dir="ltr">
                {unit.rating.toFixed(1)}
              </span>
              {unit.reviewCount && (
                <span className="text-body-sm text-warm-gray">
                  (<span className="num" dir="ltr">{formatNumber(unit.reviewCount)}</span>)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className={cn('text-title font-medium text-charcoal mb-3', isFa && 'font-persian-display')}>
          {name}
        </h3>

        {/* Stats row */}
        <div className={cn('flex items-center gap-4 text-body-sm text-warm-gray mb-4', isFa && 'flex-row-reverse')}>
          <span className={cn('flex items-center gap-1', isFa && 'flex-row-reverse')}>
            <BedDouble size={14} className="text-forest-moss" />
            <span className="num" dir="ltr">{unit.bedrooms}</span>
            <span>{t('bedrooms')}</span>
          </span>
          <span className="text-stone">·</span>
          <span className={cn('flex items-center gap-1', isFa && 'flex-row-reverse')}>
            <Users size={14} className="text-forest-moss" />
            <span className="num" dir="ltr">{unit.maxGuests}</span>
            <span>{t('guests')}</span>
          </span>
          <span className="text-stone">·</span>
          <span>
            <span className="num" dir="ltr">{unit.areaM2}</span>
            {' '}{t('sqm')}
          </span>
        </div>

        {/* Amenity chips */}
        <div className={cn('flex flex-wrap gap-1.5 mb-5', isFa && 'flex-row-reverse')}>
          {(isFa ? unit.amenitiesFa : unit.amenitiesEn).slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-0.5 bg-warm-ivory text-warm-gray text-caption rounded"
            >
              {amenity}
            </span>
          ))}
          {unit.amenitiesEn.length > 3 && (
            <span className="px-2 py-0.5 text-warm-gray text-caption">
              +<span className="num" dir="ltr">{unit.amenitiesEn.length - 3}</span>
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className={cn('flex items-center justify-between pt-4 border-t border-stone', isFa && 'flex-row-reverse')}>
          <div className={isFa ? 'text-end' : 'text-start'}>
            <div className="text-caption text-warm-gray">{t('starting_from')}</div>
            <div className="text-body-sm font-medium text-charcoal">
              <span className="num" dir="ltr">
                {formatPrice(unit.startingPriceIRR, 'IRR', locale)}
              </span>
            </div>
            <div className="text-caption text-warm-gray">{t('per_night')}</div>
          </div>

          <div className={cn('flex gap-2', isFa && 'flex-row-reverse')}>
            <Link
              href={`/${locale}/accommodations/${unit.slug}`}
              className="btn btn-outline-dark btn-sm"
            >
              {t('view_details')}
            </Link>
            <Link
              href={`/${locale}/reserve?unit=${unit.id}`}
              className="btn btn-primary btn-sm"
            >
              {t('reserve')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
