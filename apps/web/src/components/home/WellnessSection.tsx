import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import content from '@/data/content'

type Props = { locale: string }

export default function WellnessSection({ locale }: Props) {
  const isFa = locale === 'fa'
  const services = isFa ? content.wellness.servicesFa : content.wellness.servicesEn

  return (
    <section className="section bg-hiraban-pine text-warm-ivory overflow-hidden">
      <div className="container-content">
        <div className={cn('grid lg:grid-cols-2 gap-16 items-center', isFa && 'lg:flex lg:flex-row-reverse')}>
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[520px] rounded-2xl overflow-hidden">
            <Image
              src={content.wellness.image}
              alt={content.wellness.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className={isFa ? 'text-end' : ''}>
            <p className="eyebrow mb-5">{isFa ? 'سلامت و آرامش' : 'Wellness'}</p>
            <h2 className={cn('text-headline mb-6', isFa ? 'font-persian-display' : 'font-display')}>
              {isFa ? 'تجدید انرژی در دل طبیعت' : "Restore in nature's embrace"}
            </h2>
            <span className="divider-gold mb-6 block" style={{ marginInlineStart: isFa ? 'auto' : undefined }} />
            <p className="text-body-lg text-warm-ivory/75 mb-8 leading-relaxed">
              {isFa
                ? 'اتاق‌های ماساژ حرفه‌ای، جلسات یوگا در طبیعت و سکوت جنگل، آنچه بدن و ذهن شما برای تجدید انرژی نیاز دارند را فراهم می‌کنند.'
                : 'Professional massage rooms, outdoor yoga sessions and the quiet of the Hyrcanian forest provide everything your body and mind need to truly recover.'}
            </p>
            <div className={cn('grid grid-cols-2 gap-2 mb-8', isFa && 'text-end')}>
              {services.map((s) => (
                <div key={s} className={cn('flex items-center gap-2 text-body-sm text-warm-ivory/80', isFa && 'flex-row-reverse')}>
                  <span className="w-1 h-1 bg-aged-brass rounded-full flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
            <Link href={`/${locale}/wellness`} className="btn btn-primary">
              {isFa ? 'رزرو خدمات سلامتی' : 'Book wellness'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
