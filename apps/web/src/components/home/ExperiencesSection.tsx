import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import content from '@/data/content'

type Props = { locale: string }

export default function ExperiencesSection({ locale }: Props) {
  const isFa = locale === 'fa'
  const items = content.experiences.map((exp) => ({
    key: exp.key,
    title: isFa ? exp.titleFa : exp.titleEn,
    desc: isFa ? exp.descFa : exp.descEn,
    href: exp.href,
    image: exp.image,
    imageAlt: exp.imageAlt,
  }))

  return (
    <section className="section bg-deep-forest text-warm-ivory">
      <div className="container-content">
        {/* Header */}
        <div className={cn('mb-12', isFa ? 'text-end' : '')}>
          <p className="eyebrow mb-4">{isFa ? 'تجربه‌های لوتکا' : 'Lootka experiences'}</p>
          <h2 className={cn('text-headline', isFa ? 'font-persian-display' : 'font-display')}>
            {isFa ? 'فراتر از اقامت — یک مقصد کامل' : 'Beyond a stay — a complete destination'}
          </h2>
          <span className="divider-gold mt-4 block" style={{ marginInlineStart: isFa ? 'auto' : undefined }} />
        </div>

        {/* Grid — 2 column featured layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((exp, i) => (
            <Link
              key={exp.key}
              href={`/${locale}${exp.href}`}
              className={cn(
                'group relative overflow-hidden rounded-xl',
                i === 0 ? 'md:row-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-[16/9]',
              )}
              aria-label={exp.title}
            >
              <Image
                src={exp.image}
                alt={exp.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-overlay-strong" />
              <div
                className={cn(
                  'absolute inset-0 flex flex-col justify-end p-6',
                  isFa && 'items-end text-end',
                )}
              >
                <h3 className={cn(
                  'text-title text-warm-ivory font-medium mb-2',
                  isFa ? 'font-persian-display' : 'font-display',
                )}>
                  {exp.title}
                </h3>
                <p className="text-body-sm text-warm-ivory/70 mb-4 line-clamp-2">
                  {exp.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-aged-brass text-sm font-medium group-hover:gap-3 transition-all">
                  {isFa ? 'مشاهده بیشتر' : 'Explore'}
                  <span aria-hidden="true">{isFa ? '←' : '→'}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
