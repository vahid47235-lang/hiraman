import { cn } from '@/lib/utils'

type Props = { locale: string }

const stats = {
  fa: [
    { value: '17', label: 'واحد اقامتی' },
    { value: '14,000', label: 'متر مربع طبیعت' },
    { value: '12+', label: 'تجربه منحصربه‌فرد' },
    { value: '9', label: 'واحد با استخر اختصاصی' },
  ],
  en: [
    { value: '17', label: 'Accommodation units' },
    { value: '14,000', label: 'm² of nature' },
    { value: '12+', label: 'Unique experiences' },
    { value: '9', label: 'Units with private pool' },
  ],
}

export default function BrandPromise({ locale }: Props) {
  const isFa = locale === 'fa'

  return (
    <section className="section bg-white">
      <div className="container-content">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className={isFa ? 'text-end lg:order-2' : ''}>
            <p className="eyebrow mb-5">
              {isFa ? 'فراتر از یک اقامتگاه' : 'More than a place to stay'}
            </p>
            <h2 className={cn('text-headline text-charcoal mb-6', isFa ? 'font-persian-display' : 'font-display')}>
              {isFa
                ? 'یک مقصد کامل در دل جنگل'
                : 'A complete forest destination'}
            </h2>
            <span className="divider-gold mb-6 block" style={{ marginInlineStart: isFa ? 'auto' : undefined }} />
            <p className="text-body-lg text-warm-gray leading-relaxed mb-6">
              {isFa
                ? 'هیرابان صرفاً یک کلبه برای اجاره نیست. ما یک مقصد کامل جنگلی هستیم که در آن اقامت لوکس، استخر خصوصی، رستوران، کافه، سلامت و آرامش، تجربه‌های خانوادگی و ماجراجویی‌های طبیعی همه در یک سفر قابل برنامه‌ریزی و رزرو هستند.'
                : "Hiraban is not simply a cabin to rent. We are a complete forest destination — a place where private accommodation, dining, wellness, family activities and soft adventure can all be planned and reserved in a single journey, in the heart of Iran's ancient Hyrcanian forests."}
            </p>
            <p className="text-body text-warm-gray leading-relaxed">
              {isFa
                ? 'با ۱۷ واحد اقامتی منحصربه‌فرد در محوطه‌ای ۱۴ هزار متر مربعی، هر اقامت در هیرابان داستان خاص خود را دارد.'
                : 'With 17 unique accommodation units across 14,000 m² of curated forest grounds, every stay at Hiraban tells its own story.'}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-px bg-stone rounded-2xl overflow-hidden">
            {(isFa ? stats.fa : stats.en).map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="num text-4xl font-medium text-hiraban-pine mb-2 font-display" dir="ltr">
                  {stat.value}
                </div>
                <div className="text-body-sm text-warm-gray">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
