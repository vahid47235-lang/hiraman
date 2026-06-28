import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'بسته‌های اقامتی — لوتکا' : 'Packages — Lootka' }
}

const packages = {
  fa: [
    {
      name: 'بسته رمانتیک',
      duration: '۲ شب',
      price: '۱۲,۰۰۰,۰۰۰',
      desc: 'ایده‌آل برای زوج‌ها. شامل اقامت در کلبه با استخر اختصاصی، شام کندل‌لایت، ماساژ جفتی و صبحانه در تخت.',
      includes: ['۲ شب اقامت در کلبه استخردار', 'شام کندل‌لایت', 'ماساژ جفتی ۶۰ دقیقه', 'صبحانه در تخت', 'بوکه گل طبیعی'],
      img: 'photo-1571896349842-33c89424de2d',
      badge: 'محبوب‌ترین',
    },
    {
      name: 'بسته خانوادگی',
      duration: '۳ شب',
      price: '۲۴,۰۰۰,۰۰۰',
      desc: 'برای خانواده‌هایی که می‌خواهند بهترین تجربه طبیعت را در کنار هم داشته باشند.',
      includes: ['۳ شب اقامت در ویلای خانوادگی', 'صبحانه کامل روزانه', 'یک روز ماجراجویی ATV', 'بازدید از باغ حیوانات', 'ماساژ والدین'],
      img: 'photo-1526045612212-70caf35c14df',
      badge: null,
    },
    {
      name: 'بسته سلامتی',
      duration: '۴ شب',
      price: '۳۲,۰۰۰,۰۰۰',
      desc: 'برای کسانی که به دنبال آرامش عمیق و بازیابی انرژی هستند.',
      includes: ['۴ شب اقامت در کلبه لوکس', 'برنامه یوگای روزانه', '۳ جلسه ماساژ اختصاصی', 'رژیم غذایی سلامتی', 'مدیتیشن گروهی'],
      img: 'photo-1600334089648-b0d9d3028eb2',
      badge: 'جدید',
    },
  ],
  en: [
    {
      name: 'Romantic Escape',
      duration: '2 nights',
      price: '12,000,000',
      desc: 'Perfect for couples. Includes cabin with private pool, candlelit dinner, couples massage and breakfast in bed.',
      includes: ['2 nights in pool cabin', 'Candlelit dinner', '60-min couples massage', 'Breakfast in bed', 'Natural flower bouquet'],
      img: 'photo-1571896349842-33c89424de2d',
      badge: 'Most popular',
    },
    {
      name: 'Family Adventure',
      duration: '3 nights',
      price: '24,000,000',
      desc: 'For families who want the best nature experience together.',
      includes: ['3 nights in family villa', 'Full breakfast daily', 'One ATV adventure day', 'Animal garden visit', 'Parents massage'],
      img: 'photo-1526045612212-70caf35c14df',
      badge: null,
    },
    {
      name: 'Wellness Retreat',
      duration: '4 nights',
      price: '32,000,000',
      desc: 'For those seeking deep peace and energy restoration.',
      includes: ['4 nights in luxury cabin', 'Daily yoga programme', '3 private massage sessions', 'Wellness diet plan', 'Group meditation'],
      img: 'photo-1600334089648-b0d9d3028eb2',
      badge: 'New',
    },
  ],
}

export default async function PackagesPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const pkgs = isFa ? packages.fa : packages.en

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=600&q=80&auto=format&fit=crop" alt="" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'بسته‌های اقامتی' : 'Stay Packages'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'همه چیز در یک بسته' : 'Everything in one package'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-content">
          <div className="grid md:grid-cols-3 gap-8">
            {pkgs.map((pkg) => (
              <div key={pkg.name} className="card overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image src={`https://images.unsplash.com/${pkgImgMap[pkg.img] ?? 'photo-1520250497591-112f2f40a3f4'}?w=600&h=400&q=80&auto=format&fit=crop`} alt={pkg.name} fill className="object-cover" />
                  {pkg.badge && (
                    <span className="absolute top-3 start-3 px-3 py-1 bg-aged-brass text-deep-forest text-caption font-semibold rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-caption text-aged-brass mb-1">{pkg.duration}</div>
                  <h3 className={`text-title font-medium text-white mb-3 ${isFa ? 'font-persian-display' : 'font-display'}`}>{pkg.name}</h3>
                  <p className="text-body text-white/55 mb-4 leading-relaxed">{pkg.desc}</p>
                  <ul className="space-y-1.5 mb-6 flex-1">
                    {pkg.includes.map((item) => (
                      <li key={item} className={`text-body-sm text-white flex items-center gap-2 ${isFa ? 'flex-row-reverse' : ''}`}>
                        <span className="text-forest-moss flex-shrink-0">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-caption text-white/55 mb-1">{isFa ? 'شروع از' : 'Starting from'}</div>
                    <div className="text-title font-semibold text-white mb-4 num" dir="ltr">
                      {pkg.price} {isFa ? 'تومان' : 'IRT'}
                    </div>
                    <Link href={`/${locale}/reserve`} className="btn btn-primary w-full text-center">
                      {isFa ? 'رزرو این بسته' : 'Book this package'}
                    </Link>
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
