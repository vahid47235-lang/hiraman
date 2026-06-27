import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/data/content'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'سلامتی و اسپا — هیرابان' : 'Wellness & Spa — Hiraban' }
}

export default async function WellnessPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const content = await getContent()

  const services = isFa ? content.wellness.servicesFa : content.wellness.servicesEn

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src={content.wellness.image} alt="" fill className="object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'سلامتی و اسپا' : 'Wellness & Spa'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'بازیابی انرژی در دل طبیعت' : 'Restore yourself in nature'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-4">{isFa ? 'خدمات سلامتی' : 'Our Services'}</p>
              <h2 className={`text-headline text-charcoal mb-6 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'آرامش واقعی برای روح و جسم' : 'True peace for body and soul'}
              </h2>
              <p className="text-body text-warm-gray mb-8 leading-relaxed">
                {isFa
                  ? 'مرکز سلامتی هیرابان با بهترین متخصصان ماساژ، یوگا و مدیتیشن، محیطی آرام برای بازیابی انرژی شما فراهم کرده است.'
                  : 'Hiraban\'s wellness centre brings together expert massage therapists, yoga instructors and meditation guides in a serene forest setting.'}
              </p>
              <ul className="space-y-3 mb-8">
                {services.map((s) => (
                  <li key={s} className={`flex items-center gap-3 text-body text-charcoal ${isFa ? 'flex-row-reverse' : ''}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-aged-brass flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/reserve`} className="btn btn-primary">
                {isFa ? 'رزرو خدمات سلامتی' : 'Book wellness services'}
              </Link>
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={content.wellness.image} alt="" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-hiraban-pine text-warm-ivory">
        <div className="container-content text-center">
          <h2 className={`text-headline mb-4 ${isFa ? 'font-persian-display' : 'font-display'}`}>
            {isFa ? 'یوگای جنگل — تجربه‌ای منحصربه‌فرد' : 'Forest Yoga — a unique experience'}
          </h2>
          <p className="text-body text-warm-ivory/70 max-w-xl mx-auto mb-8 leading-relaxed">
            {isFa
              ? 'هر صبح، جلسات یوگا در دل جنگل هیرکانی برگزار می‌شود. صدای پرندگان، بوی خاک مرطوب و هوای پاک کوهستان را تنفس کنید.'
              : 'Every morning, yoga sessions are held deep in the Hyrcanian forest. Breathe in birdsong, the scent of damp earth and fresh mountain air.'}
          </p>
          <Link href={`/${locale}/reserve`} className="btn btn-primary">
            {isFa ? 'رزرو یوگای جنگل' : 'Book forest yoga'}
          </Link>
        </div>
      </section>
    </div>
  )
}
