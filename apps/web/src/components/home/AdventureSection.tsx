import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function AdventureSection({ locale }: Props) {
  const isFa = locale === 'fa'

  const adventures = isFa
    ? [
        { title: 'ATV جنگلی', desc: 'رانندگی در مسیرهای کنترل‌شده جنگلی با تجهیزات ایمنی کامل', duration: '1-2 ساعت', minAge: '14 سال', href: '/adventure#atv', image: 'https://picsum.photos/seed/atv-trail/900/600', imageAlt: 'ATV در جنگل' },
        { title: 'اسب‌سواری', desc: 'اسب‌سواری در مسیرهای جنگلی با راهنمای حرفه‌ای', duration: '1-3 ساعت', minAge: '8 سال', href: '/adventure#horse', image: 'https://picsum.photos/seed/horse-riding/900/600', imageAlt: 'اسب‌سواری در جنگل' },
      ]
    : [
        { title: 'Forest ATV', desc: 'Guided rides on approved forest trails with full safety equipment', duration: '1-2 hours', minAge: 'Age 14+', href: '/adventure#atv', image: 'https://picsum.photos/seed/atv-trail/900/600', imageAlt: 'ATV on forest trail' },
        { title: 'Horse Riding', desc: 'Supervised trail rides through the Hyrcanian forest with professional guides', duration: '1-3 hours', minAge: 'Age 8+', href: '/adventure#horse', image: 'https://picsum.photos/seed/horse-riding/900/600', imageAlt: 'Horse riding through forest' },
      ]

  return (
    <section className="section">
      <div className="container-content">
        <div className={cn('mb-12', isFa ? 'text-end' : '')}>
          <p className="eyebrow mb-4">{isFa ? 'ماجراجویی' : 'Adventure'}</p>
          <h2 className={cn('text-headline', isFa ? 'font-persian-display' : 'font-display')}>
            {isFa ? 'ماجرا در قلب جنگل' : 'Adventure in the heart of the forest'}
          </h2>
          <span className="divider-gold mt-4 block" style={{ marginInlineStart: isFa ? 'auto' : undefined }} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {adventures.map((adv) => (
            <Link key={adv.title} href={`/${locale}${adv.href}`} className="group relative overflow-hidden rounded-xl aspect-[16/9]">
              <Image src={adv.image} alt={adv.imageAlt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-overlay-strong" />
              <div className={cn('absolute inset-x-0 bottom-0 p-6', isFa && 'text-end')}>
                <h3 className={cn('text-title font-medium mb-2', isFa ? 'font-persian-display' : 'font-display')}>{adv.title}</h3>
                <p className="text-body-sm text-warm-ivory/70 mb-4 line-clamp-2">{adv.desc}</p>
                <div className={cn('flex gap-4 text-caption text-warm-ivory/50', isFa && 'flex-row-reverse')}>
                  <span>⏱ <span className="bidi-isolate" dir="ltr">{adv.duration}</span></span>
                  <span>👤 {adv.minAge}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href={`/${locale}/adventure`} className="btn btn-secondary">
            {isFa ? 'مشاهده همه تجربه‌های ماجراجویی' : 'All adventure experiences'}
          </Link>
        </div>
      </div>
    </section>
  )
}
