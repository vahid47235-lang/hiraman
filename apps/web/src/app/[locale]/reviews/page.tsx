import { getContent } from '@/data/content'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'نظرات مهمانان — لوتکا' : 'Guest Reviews — Lootka' }
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const content = await getContent()

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="py-20 pt-32">
        <div className="container-content text-center">
          <p className="eyebrow mb-4">{isFa ? 'نظرات مهمانان' : 'Guest Reviews'}</p>
          <h1 className={`text-display text-warm-ivory mb-4 ${isFa ? 'font-persian-display' : 'font-display'}`}>
            {isFa ? 'آنچه مهمانان می‌گویند' : 'What our guests say'}
          </h1>
          <div className="flex justify-center gap-8 mt-8">
            <div><div className="text-3xl font-semibold text-aged-brass num" dir="ltr">4.9</div><div className="text-body-sm text-warm-ivory/60">{isFa ? 'میانگین امتیاز' : 'Average rating'}</div></div>
            <div><div className="text-3xl font-semibold text-aged-brass num" dir="ltr">500+</div><div className="text-body-sm text-warm-ivory/60">{isFa ? 'نظر تأییدشده' : 'Verified reviews'}</div></div>
            <div><div className="text-3xl font-semibold text-aged-brass num" dir="ltr">98%</div><div className="text-body-sm text-warm-ivory/60">{isFa ? 'توصیه می‌کنند' : 'Would recommend'}</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-content">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex gap-1 mb-4 text-aged-brass">{'★'.repeat(review.rating)}</div>
                <p className="text-body text-white/55 leading-relaxed mb-6 italic">
                  "{isFa ? review.textFa : review.textEn}"
                </p>
                <div className={`flex items-center gap-3 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-forest-moss/20 flex items-center justify-center text-forest-moss font-semibold flex-shrink-0">
                    {(isFa ? review.authorFa : review.authorEn).charAt(0)}
                  </div>
                  <div>
                    <div className="text-body-sm font-semibold text-white">{isFa ? review.authorFa : review.authorEn}</div>
                    <div className="text-caption text-white/55">{isFa ? review.locationFa : review.locationEn}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
