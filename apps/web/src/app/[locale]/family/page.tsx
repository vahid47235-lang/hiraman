import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'تجربه خانوادگی — لوتکا' : 'Family Experience — Lootka' }
}

const activities = {
  fa: [
    { title: 'باغ کودکان', desc: 'فضای بازی ایمن و طبیعی برای کودکان با تجهیزات چوبی اکولوژیک', img: 'family-playground' },
    { title: 'باغ حیوانات', desc: 'آشنایی با حیوانات اهلی و وحشی در محیطی امن و آموزشی', img: 'family-animals' },
    { title: 'گلخانه و باغبانی', desc: 'تجربه کشت و برداشت محصولات ارگانیک در کنار خانواده', img: 'family-garden' },
    { title: 'ستاره‌شناسی', desc: 'تماشای آسمان شب در جنگل‌های دور از آلودگی نوری', img: 'family-stars' },
  ],
  en: [
    { title: "Children's Garden", desc: 'Safe natural play space for children with eco-friendly wooden equipment', img: 'family-playground' },
    { title: 'Animal Garden', desc: 'Meet domestic and wild animals in a safe, educational environment', img: 'family-animals' },
    { title: 'Greenhouse & Gardening', desc: 'Experience planting and harvesting organic produce as a family', img: 'family-garden' },
    { title: 'Stargazing', desc: 'Watch the night sky in forests far from light pollution', img: 'family-stars' },
  ],
}

export default async function FamilyPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const acts = isFa ? activities.fa : activities.en

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/family-hero/1920/600" alt="" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'تجربه خانوادگی' : 'Family Experience'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'خاطره‌سازی با خانواده' : 'Making memories together'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <p className="text-body text-warm-gray max-w-2xl mb-12 leading-relaxed">
            {isFa
              ? 'لوتکا مقصدی ایده‌آل برای خانواده‌هاست. فعالیت‌های متنوع برای کودکان، فضاهای امن و محیط طبیعی بی‌نظیر، اقامتی به‌یادماندنی برای همه اعضای خانواده فراهم می‌کند.'
              : 'Lootka is an ideal destination for families. Diverse activities for children, safe spaces and a stunning natural environment create an unforgettable stay for every family member.'}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {acts.map((act) => (
              <div key={act.title} className="card overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <Image src={`https://picsum.photos/seed/${act.img}/700/400`} alt={act.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className={`text-title font-medium text-charcoal mb-2 ${isFa ? 'font-persian-display' : 'font-display'}`}>{act.title}</h3>
                  <p className="text-body text-warm-gray">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={`/${locale}/reserve`} className="btn btn-primary btn-lg">
              {isFa ? 'رزرو اقامت خانوادگی' : 'Book family stay'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
