import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/data/content'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return {
    title: locale === 'fa' ? 'تجربه‌ها — لوتکا' : 'Experiences — Lootka',
  }
}

export default async function ExperiencesPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const content = await getContent()

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/experiences-hero/1920/600" alt="" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'تجربه‌ها' : 'Experiences'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'لحظه‌هایی که فراموش نمی‌شود' : 'Moments you will never forget'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.experiences.map((exp) => (
              <div key={exp.key} className="card group overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={exp.image} alt={isFa ? exp.titleFa : exp.titleEn} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h2 className={`text-title font-medium text-charcoal mb-3 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                    {isFa ? exp.titleFa : exp.titleEn}
                  </h2>
                  <p className="text-body text-warm-gray leading-relaxed">
                    {isFa ? exp.descFa : exp.descEn}
                  </p>
                  <Link href={`/${locale}/reserve`} className="btn btn-primary btn-sm mt-5 inline-flex">
                    {isFa ? 'رزرو این تجربه' : 'Book this experience'}
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
