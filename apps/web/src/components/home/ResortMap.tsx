'use client'

import { useState } from 'react'
import { MapPin, Phone, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function ResortMap({ locale }: Props) {
  const isFa = locale === 'fa'
  const [mapConsent, setMapConsent] = useState(false)

  return (
    <section className="section bg-warm-ivory">
      <div className="container-content">
        <div className={cn('grid lg:grid-cols-2 gap-12 items-center')}>
          {/* Info */}
          <div className={isFa ? 'text-end lg:order-2' : ''}>
            <p className="eyebrow mb-5">{isFa ? 'مکان و دسترسی' : 'Location & access'}</p>
            <h2 className={cn('text-headline text-charcoal mb-6', isFa ? 'font-persian-display' : 'font-display')}>
              {isFa ? 'چگونه به لوتکا برسیم؟' : 'Getting to Lootka'}
            </h2>
            <span className="divider-gold mb-6 block" style={{ marginInlineStart: isFa ? 'auto' : undefined }} />

            <div className={cn('space-y-4 mb-8')}>
              <div className={cn('flex items-start gap-3', isFa && 'flex-row-reverse')}>
                <MapPin size={18} className="text-aged-brass mt-0.5 flex-shrink-0" />
                <div className={isFa ? 'text-end' : ''}>
                  <div className="text-sm font-medium text-charcoal mb-1">
                    {isFa ? 'آدرس' : 'Address'}
                  </div>
                  <div className="text-body text-warm-gray">
                    {isFa
                      ? 'آدرس دقیق پس از تأیید رزرو ارسال می‌شود'
                      : 'Exact address provided after booking confirmation'}
                  </div>
                </div>
              </div>
              <div className={cn('flex items-start gap-3', isFa && 'flex-row-reverse')}>
                <Phone size={18} className="text-aged-brass mt-0.5 flex-shrink-0" />
                <div className={isFa ? 'text-end' : ''}>
                  <div className="text-sm font-medium text-charcoal mb-1">
                    {isFa ? 'تلفن' : 'Phone'}
                  </div>
                  <a
                    href="tel:+989125584407"
                    className="text-body text-lootka-pine hover:text-aged-brass transition-colors num"
                    dir="ltr"
                  >
                    +98 912 558 4407
                  </a>
                </div>
              </div>
            </div>

            <div className={cn('flex gap-3', isFa && 'flex-row-reverse')}>
              <a
                href="tel:+989125584407"
                className="btn btn-outline-dark flex items-center gap-2"
                aria-label={isFa ? 'تماس تلفنی با لوتکا' : 'Call Lootka'}
              >
                <Phone size={16} />
                {isFa ? 'تماس' : 'Call'}
              </a>
              <a
                href="https://wa.me/989125584407"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex items-center gap-2"
                aria-label={isFa ? 'پیام واتس‌اپ به لوتکا' : 'WhatsApp Lootka'}
              >
                <MessageCircle size={16} />
                {isFa ? 'واتس‌اپ' : 'WhatsApp'}
              </a>
            </div>
          </div>

          {/* Map with consent */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone/30">
            {mapConsent ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d50!3d36"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={isFa ? 'موقعیت لوتکا روی نقشه' : 'Lootka location on map'}
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-warm-ivory">
                <MapPin size={40} className="text-forest-moss mb-4" />
                <p className="text-body-sm text-charcoal mb-2">
                  {isFa
                    ? 'نمایش نقشه گوگل به اتصال به سرورهای گوگل نیاز دارد.'
                    : 'Displaying the map connects to Google\'s servers.'}
                </p>
                <p className="text-caption text-warm-gray mb-5">
                  {isFa
                    ? 'با کلیک روی دکمه، رضایت خود را اعلام می‌کنید.'
                    : 'By clicking, you consent to loading Google Maps.'}
                </p>
                <button
                  onClick={() => setMapConsent(true)}
                  className="btn btn-outline-dark btn-sm"
                >
                  {isFa ? 'نمایش نقشه' : 'Show map'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
