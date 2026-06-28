import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function FamilySection({ locale }: Props) {
  const isFa = locale === 'fa'

  const highlights = isFa
    ? [
        { icon: '🐇', title: 'باغچه حیوانات', desc: 'آشنایی ایمن با حیوانات دوست‌داشتنی' },
        { icon: '🌱', title: 'گلخانه', desc: 'کاشت، مراقبت و یادگیری از طبیعت' },
        { icon: '🎠', title: 'فضای بازی', desc: 'فضای بازی ایمن برای کودکان' },
      ]
    : [
        { icon: '🐇', title: 'Animal Garden', desc: 'Safe and gentle interactions with friendly animals' },
        { icon: '🌱', title: 'Greenhouse', desc: 'Planting, nurturing and learning from nature' },
        { icon: '🎠', title: 'Playground', desc: 'Safe play area designed for children' },
      ]

  return (
    <section className="section">
      <div className="container-content">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={isFa ? 'text-end lg:order-2' : ''}>
            <p className="eyebrow mb-5">{isFa ? 'لوتکا برای خانواده' : 'Lootka for families'}</p>
            <h2 className={cn('text-headline text-white mb-6', isFa ? 'font-persian-display' : 'font-display')}>
              {isFa ? 'خاطرات خانوادگی که ماندگار می‌شوند' : 'Family memories that last'}
            </h2>
            <span className="divider-gold mb-6 block" style={{ marginInlineStart: isFa ? 'auto' : undefined }} />
            <p className="text-body-lg text-white/55 mb-8 leading-relaxed">
              {isFa
                ? 'لوتکا برای خانواده‌های با کودک طراحی شده است. از باغچه حیوانات و گلخانه تا فضای بازی ایمن و تجربه‌های آموزشی — هر لحظه‌ای که کودکان شما در لوتکا می‌گذرانند، لحظه‌ای آموزنده و به‌یادماندنی خواهد بود.'
                : "Lootka is thoughtfully designed for families with children. From the animal garden and greenhouse to the safe playground and hands-on nature activities — every moment your children spend at Lootka will be both educational and unforgettable."}
            </p>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {highlights.map((h) => (
                <div key={h.title} className={cn('flex items-start gap-4 p-4 bg-[#111111] rounded-xl border border-white/10', isFa && 'flex-row-reverse text-end')}>
                  <span className="text-2xl">{h.icon}</span>
                  <div>
                    <div className="font-medium text-white mb-1">{h.title}</div>
                    <div className="text-body-sm text-white/55">{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/family`} className="btn btn-outline-dark">
              {isFa ? 'تجربه‌های خانوادگی' : 'Family experiences'}
            </Link>
          </div>
          <div className={cn('grid grid-cols-2 gap-3', isFa && 'lg:order-1')}>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src="https://picsum.photos/seed/family-forest/600/900" alt={isFa ? 'فعالیت خانوادگی' : 'Family activity'} fill className="object-cover" sizes="25vw" />
            </div>
            <div className="grid grid-rows-2 gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="https://picsum.photos/seed/kids-garden/600/600" alt={isFa ? 'باغچه حیوانات' : 'Animal garden'} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="https://picsum.photos/seed/greenhouse-nature/600/600" alt={isFa ? 'گلخانه' : 'Greenhouse'} fill className="object-cover" sizes="25vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
