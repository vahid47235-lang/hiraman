import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'ماجراجویی — لوتکا' : 'Adventure — Lootka' }
}

const adventures = {
  fa: [
    { title: 'ATV و موتور چهارچرخ', desc: 'کشف مسیرهای جنگلی با موتور ATV در طبیعت بکر هیرکانی', img: 'adventure-atv' },
    { title: 'اسب‌سواری', desc: 'سواری آرام یا هیجان‌انگیز در جنگل‌های انبوه شمال ایران', img: 'adventure-horse' },
    { title: 'کوه‌نوردی و پیاده‌روی', desc: 'مسیرهای طبیعت‌گردی با سطوح مختلف برای همه افراد', img: 'adventure-hike' },
    { title: 'ماهیگیری', desc: 'ماهیگیری در رودخانه‌های صاف جنگلی با راهنمای متخصص', img: 'adventure-fishing' },
  ],
  en: [
    { title: 'ATV & Quad Biking', desc: 'Discover forest trails on ATV bikes through pristine Hyrcanian nature', img: 'adventure-atv' },
    { title: 'Horse Riding', desc: 'Gentle or thrilling rides through the dense forests of northern Iran', img: 'adventure-horse' },
    { title: 'Hiking & Trekking', desc: 'Nature trails at all difficulty levels for everyone', img: 'adventure-hike' },
    { title: 'Fishing', desc: 'Fish in crystal-clear forest rivers with an expert guide', img: 'adventure-fishing' },
  ],
}

export default async function AdventurePage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const acts = isFa ? adventures.fa : adventures.en

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/adventure-hero/1920/600" alt="" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'ماجراجویی' : 'Adventure'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'هیجان در دل جنگل' : 'Thrills in the heart of the forest'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-8">
            {acts.map((act) => (
              <div key={act.title} className="card overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <Image src={`https://picsum.photos/seed/${act.img}/700/400`} alt={act.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className={`text-title font-medium text-charcoal mb-2 ${isFa ? 'font-persian-display' : 'font-display'}`}>{act.title}</h3>
                  <p className="text-body text-warm-gray mb-4">{act.desc}</p>
                  <Link href={`/${locale}/reserve`} className="btn btn-outline-dark btn-sm">
                    {isFa ? 'رزرو' : 'Book'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
