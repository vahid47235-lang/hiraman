import Image from 'next/image'
import { getContent } from '@/data/content'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'تماس — هیرابان' : 'Contact — Hiraban' }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const content = await getContent()

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/contact-hero/1920/600" alt="" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'تماس با ما' : 'Contact Us'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'در تماس باشید' : 'Get in touch'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <p className="eyebrow mb-4">{isFa ? 'اطلاعات تماس' : 'Contact information'}</p>
              <h2 className={`text-headline text-charcoal mb-8 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'چطور به ما برسید' : 'How to reach us'}
              </h2>

              <div className="space-y-6">
                <div className={`flex items-start gap-4 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-hiraban-pine/10 flex items-center justify-center flex-shrink-0 text-forest-moss">📞</div>
                  <div>
                    <div className="text-body-sm font-semibold text-charcoal mb-1">{isFa ? 'تلفن' : 'Phone'}</div>
                    <a href={`tel:${content.contact.phone}`} className="text-body text-warm-gray hover:text-hiraban-pine transition-colors num" dir="ltr">
                      {content.contact.phone}
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-4 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-hiraban-pine/10 flex items-center justify-center flex-shrink-0 text-forest-moss">💬</div>
                  <div>
                    <div className="text-body-sm font-semibold text-charcoal mb-1">WhatsApp</div>
                    <a href={`https://wa.me/${content.contact.phone.replace(/[^0-9]/g, '')}`} className="text-body text-warm-gray hover:text-hiraban-pine transition-colors num" dir="ltr">
                      {content.contact.phone}
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-4 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-hiraban-pine/10 flex items-center justify-center flex-shrink-0 text-forest-moss">✉️</div>
                  <div>
                    <div className="text-body-sm font-semibold text-charcoal mb-1">{isFa ? 'ایمیل' : 'Email'}</div>
                    <a href={`mailto:${content.contact.email}`} className="text-body text-warm-gray hover:text-hiraban-pine transition-colors">
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                <div className={`flex items-start gap-4 ${isFa ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-hiraban-pine/10 flex items-center justify-center flex-shrink-0 text-forest-moss">📍</div>
                  <div>
                    <div className="text-body-sm font-semibold text-charcoal mb-1">{isFa ? 'آدرس' : 'Address'}</div>
                    <p className="text-body text-warm-gray leading-relaxed">
                      {isFa ? content.contact.addressFa : content.contact.addressEn}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-white rounded-xl border border-stone">
                <div className="text-body-sm font-semibold text-charcoal mb-2">{isFa ? 'ساعات پاسخگویی' : 'Response hours'}</div>
                <p className="text-body text-warm-gray">
                  {isFa ? 'شنبه تا پنجشنبه، ساعت ۸ صبح تا ۱۰ شب' : 'Saturday to Thursday, 8am – 10pm'}
                </p>
                <p className="text-body text-warm-gray mt-1">
                  {isFa ? 'جمعه، ساعت ۱۰ صبح تا ۶ عصر' : 'Friday, 10am – 6pm'}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-stone">
              <h3 className={`text-title font-medium text-charcoal mb-6 ${isFa ? 'font-persian-display' : 'font-display'}`}>
                {isFa ? 'پیام بفرستید' : 'Send a message'}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="text-body-sm font-medium text-charcoal block mb-1.5">
                    {isFa ? 'نام و نام خانوادگی' : 'Full name'}
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-stone rounded-lg text-body focus:outline-none focus:border-hiraban-pine transition-colors" />
                </div>
                <div>
                  <label className="text-body-sm font-medium text-charcoal block mb-1.5">
                    {isFa ? 'شماره تماس' : 'Phone number'}
                  </label>
                  <input type="tel" dir="ltr" className="w-full px-4 py-3 border border-stone rounded-lg text-body focus:outline-none focus:border-hiraban-pine transition-colors" />
                </div>
                <div>
                  <label className="text-body-sm font-medium text-charcoal block mb-1.5">
                    {isFa ? 'ایمیل' : 'Email'}
                  </label>
                  <input type="email" dir="ltr" className="w-full px-4 py-3 border border-stone rounded-lg text-body focus:outline-none focus:border-hiraban-pine transition-colors" />
                </div>
                <div>
                  <label className="text-body-sm font-medium text-charcoal block mb-1.5">
                    {isFa ? 'موضوع' : 'Subject'}
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-stone rounded-lg text-body focus:outline-none focus:border-hiraban-pine transition-colors" />
                </div>
                <div>
                  <label className="text-body-sm font-medium text-charcoal block mb-1.5">
                    {isFa ? 'پیام' : 'Message'}
                  </label>
                  <textarea rows={4} className="w-full px-4 py-3 border border-stone rounded-lg text-body focus:outline-none focus:border-hiraban-pine transition-colors resize-none" />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  {isFa ? 'ارسال پیام' : 'Send message'}
                </button>
              </form>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-16 rounded-2xl overflow-hidden h-72 relative">
            <Image src="https://picsum.photos/seed/map-north-iran/1400/400" alt="" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-deep-forest/40">
              <div className="text-center text-warm-ivory">
                <div className="text-3xl mb-2">📍</div>
                <div className={`text-title font-medium ${isFa ? 'font-persian-display' : 'font-display'}`}>
                  {isFa ? 'هیرابان — جنگل هیرکانی، شمال ایران' : 'Hiraban — Hyrcanian Forest, Northern Iran'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
