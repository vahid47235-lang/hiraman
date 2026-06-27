import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'رستوران — لوتکا' : 'Restaurant — Lootka' }
}

export default async function RestaurantPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'

  const menu = isFa ? [
    { cat: 'صبحانه', items: ['صبحانه ایرانی سنتی با نان تازه', 'تخم‌مرغ آب‌پز با سبزیجات جنگلی', 'عسل طبیعی و خامه محلی'] },
    { cat: 'ناهار', items: ['خورش مرغ با قارچ جنگلی', 'چلوکباب با برنج هیرکانی', 'سالاد سبزیجات ارگانیک'] },
    { cat: 'شام', items: ['ماهی قزل‌آلای تازه با سبزیجات کوهی', 'گوشت بره با سس آلو', 'دسر انجیر با خامه جنگلی'] },
  ] : [
    { cat: 'Breakfast', items: ['Traditional Iranian breakfast with fresh bread', 'Poached eggs with forest greens', 'Natural honey and local clotted cream'] },
    { cat: 'Lunch', items: ['Chicken stew with forest mushrooms', 'Chelow kebab with Hyrcanian rice', 'Organic garden salad'] },
    { cat: 'Dinner', items: ['Fresh trout with mountain herbs', 'Lamb with plum sauce', 'Fig dessert with forest cream'] },
  ]

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/restaurant-hero/1920/600" alt="" fill className="object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'رستوران' : 'Restaurant'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'طعم طبیعت روی سفره شما' : 'The taste of nature on your table'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow mb-4">{isFa ? 'منوی ما' : 'Our Menu'}</p>
              <h2 className={`text-headline text-charcoal mb-6 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'غذاهای محلی با مواد ارگانیک' : 'Local dishes with organic ingredients'}
              </h2>
              <p className="text-body text-warm-gray mb-8 leading-relaxed">
                {isFa
                  ? 'رستوران لوتکا از مواد اولیه تازه و ارگانیک که مستقیم از باغ‌ها و مزارع محلی تهیه می‌شود، بهره می‌گیرد.'
                  : 'Lootka restaurant uses fresh organic ingredients sourced directly from local gardens and farms.'}
              </p>
              {menu.map((section) => (
                <div key={section.cat} className="mb-6">
                  <h3 className="text-body font-semibold text-aged-brass mb-2">{section.cat}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item} className={`text-body text-warm-gray flex items-center gap-2 ${isFa ? 'flex-row-reverse' : ''}`}>
                        <span className="w-1 h-1 rounded-full bg-stone flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link href={`/${locale}/reserve`} className="btn btn-primary mt-4">
                {isFa ? 'رزرو میز' : 'Reserve a table'}
              </Link>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image src="https://picsum.photos/seed/restaurant-food/800/500" alt="" fill className="object-cover" />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="https://picsum.photos/seed/restaurant-interior/600/600" alt="" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
