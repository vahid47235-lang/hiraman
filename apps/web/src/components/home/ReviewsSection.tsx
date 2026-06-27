import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import content from '@/data/content'

type Props = { locale: string }

export default function ReviewsSection({ locale }: Props) {
  const isFa = locale === 'fa'
  const reviews = content.reviews.map(r => ({
    id: r.id,
    author: isFa ? r.authorFa : r.authorEn,
    location: isFa ? r.locationFa : r.locationEn,
    text: isFa ? r.textFa : r.textEn,
    rating: r.rating,
    date: r.date,
    avatarUrl: r.avatarUrl,
  }))

  return (
    <section className="section bg-white">
      <div className="container-content">
        {/* Header */}
        <div className={cn('mb-12', isFa ? 'text-end' : '')}>
          <p className="eyebrow mb-4">{isFa ? 'نظرات مهمانان' : 'Guest reviews'}</p>
          <div className={cn('flex items-end justify-between gap-8', isFa && 'flex-row-reverse')}>
            <div>
              <h2 className={cn('text-headline text-charcoal', isFa ? 'font-persian-display' : 'font-display')}>
                {isFa ? 'آنچه مهمانان ما می‌گویند' : 'What our guests say'}
              </h2>
              <span className="divider-gold mt-4 block" />
            </div>
            {/* Overall rating badge */}
            <div className={cn('flex items-center gap-2 text-hiraban-pine', isFa && 'flex-row-reverse')}>
              <div className="text-4xl font-display font-medium">4.9</div>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className="text-aged-brass fill-aged-brass" />
                  ))}
                </div>
                <div className="text-caption text-warm-gray mt-0.5">
                  {isFa ? 'بر اساس نظرات تأیید شده' : 'Based on verified stays'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="bg-warm-ivory rounded-xl p-6"
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Stars */}
              <div className={cn('flex gap-0.5 mb-4', isFa && 'flex-row-reverse')}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? 'text-aged-brass fill-aged-brass' : 'text-stone fill-stone'}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-body text-charcoal leading-relaxed mb-5 line-clamp-3" itemProp="reviewBody">
                "{review.text}"
              </p>

              {/* Meta */}
              <div className={cn('flex items-center gap-3 border-t border-stone pt-4', isFa && 'flex-row-reverse')}>
                {review.avatarUrl && (
                  <Image
                    src={review.avatarUrl}
                    alt={review.author}
                    width={36} height={36}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="text-body-sm font-medium text-charcoal" itemProp="author">
                    {review.author}
                  </div>
                  <div className="text-caption text-warm-gray mt-0.5">{review.location}</div>
                </div>
                <div className="text-caption text-warm-gray/60 num" dir="ltr">
                  {review.date}
                </div>
              </div>

              {/* Verified badge */}
              <div className={cn('mt-3 flex items-center gap-1.5 text-caption text-forest-moss', isFa && 'flex-row-reverse')}>
                <span className="w-1.5 h-1.5 bg-forest-moss rounded-full" />
                {isFa ? 'اقامت تأیید شده' : 'Verified stay'}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href={`/${locale}/reviews`} className="btn btn-outline-dark">
            {isFa ? 'مشاهده همه نظرات' : 'Read all reviews'}
          </a>
        </div>
      </div>
    </section>
  )
}
