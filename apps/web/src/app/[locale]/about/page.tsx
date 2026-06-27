import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'درباره لوتکا' : 'About Lootka' }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-96 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/about-hero/1920/700" alt="" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-end container-content pb-16 pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'درباره ما' : 'About Us'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'داستان لوتکا' : 'The Lootka Story'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="eyebrow mb-4">{isFa ? 'ما کی هستیم' : 'Who we are'}</p>
              <h2 className={`text-headline text-charcoal mb-6 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'از عشق به طبیعت تا لوکس‌ترین اقامتگاه' : 'From a love of nature to a luxury retreat'}
              </h2>
              <p className="text-body text-warm-gray mb-5 leading-relaxed">
                {isFa
                  ? 'لوتکا از یک رویا آغاز شد؛ رویای ترکیب لوکس‌ترین خدمات اقامتی با طبیعت بکر و دست‌نخورده جنگل‌های هیرکانی در شمال ایران.'
                  : 'Lootka began with a dream — to combine the finest hospitality with the pristine, untouched nature of the Hyrcanian forests in northern Iran.'}
              </p>
              <p className="text-body text-warm-gray mb-5 leading-relaxed">
                {isFa
                  ? 'ما باور داریم که لوکس بودن به معنای دور شدن از طبیعت نیست. برعکس، عمیق‌ترین تجربه رفاه زمانی اتفاق می‌افتد که انسان با محیط اطرافش هماهنگ باشد.'
                  : 'We believe luxury does not mean leaving nature behind. On the contrary, the deepest sense of wellbeing comes when people live in harmony with their surroundings.'}
              </p>
              <p className="text-body text-warm-gray leading-relaxed">
                {isFa
                  ? 'هر کلبه، هر تجربه و هر لحظه در لوتکا با دقت و عشق طراحی شده تا سفر شما به شمال ایران را به خاطره‌ای ماندگار تبدیل کند.'
                  : 'Every cabin, every experience and every moment at Lootka is designed with care and love to make your journey to northern Iran an unforgettable memory.'}
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image src="https://picsum.photos/seed/about-story/700/700" alt="" fill className="object-cover" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 py-12 border-y border-stone">
            {[
              { num: '۱۷', label: isFa ? 'واحد اقامتی' : 'Accommodation units' },
              { num: '۱۴,۰۰۰', label: isFa ? 'متر مربع فضای سبز' : 'sqm of green space' },
              { num: '۵۰۰+', label: isFa ? 'مهمان راضی' : 'Happy guests' },
            ].map((stat) => (
              <div key={stat.num} className="text-center">
                <div className="text-4xl font-semibold text-aged-brass mb-2 num" dir="ltr">{stat.num}</div>
                <div className="text-body text-warm-gray">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-20">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image src="https://picsum.photos/seed/about-forest/800/500" alt="" fill className="object-cover" />
            </div>
            <div>
              <p className="eyebrow mb-4">{isFa ? 'طبیعت هیرکانی' : 'Hyrcanian Nature'}</p>
              <h2 className={`text-headline text-charcoal mb-6 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'جنگل‌های هزارساله' : 'Ancient forests'}
              </h2>
              <p className="text-body text-warm-gray mb-5 leading-relaxed">
                {isFa
                  ? 'جنگل‌های هیرکانی یکی از قدیمی‌ترین و ارزشمندترین اکوسیستم‌های جهان هستند. این جنگل‌ها بیش از ۴۰ میلیون سال قدمت دارند و در سال ۲۰۱۹ به عنوان میراث جهانی یونسکو ثبت شدند.'
                  : 'The Hyrcanian forests are among the oldest and most valuable ecosystems in the world. These forests are over 40 million years old and were designated a UNESCO World Heritage Site in 2019.'}
              </p>
              <Link href={`/${locale}/reserve`} className="btn btn-primary">
                {isFa ? 'همین حالا رزرو کنید' : 'Book your stay now'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
