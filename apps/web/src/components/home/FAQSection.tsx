'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = { locale: string }

const FAQ_ITEMS = {
  fa: [
    {
      q: 'لوتکا کجاست و مسیر دسترسی به آن چگونه است؟',
      a: 'لوتکا در شمال ایران، در منطقه جنگلی هیرکانی قرار دارد. پس از تأیید رزرو، آدرس دقیق، لوکیشن نقشه و راهنمای دسترسی برای مهمان ارسال می‌شود. فاصله و مدت زمان دسترسی از شهرهای بزرگ در بخش دسترسی همین صفحه موجود است.',
    },
    {
      q: 'کدام کلبه‌های لوتکا استخر اختصاصی دارند؟',
      a: 'تقریباً نیمی از واحدهای اقامتی لوتکا دارای استخر اختصاصی هستند. در صفحه اقامتگاه‌ها می‌توانید فیلتر «استخر اختصاصی» را انتخاب کنید. در صفحه هر واحد نیز نوع استخر، گرمایش و فصل قابل استفاده به وضوح مشخص شده است.',
    },
    {
      q: 'ساعت ورود و خروج چه زمانی است؟',
      a: 'ساعت ورود و خروج در صفحه هر اقامتگاه مشخص شده است. امکان ورود زودتر یا خروج دیرتر، در صورت موجودی واحد و با هماهنگی قبلی با پذیرش لوتکا، فراهم خواهد بود.',
    },
    {
      q: 'آیا لوتکا برای خانواده‌های دارای کودک مناسب است؟',
      a: 'بله. لوتکا دارای فضای بازی کودکان، باغچه حیوانات، گلخانه و تجربه‌های خانوادگی ویژه است. شرایط سنی، ساعات فعالیت و الزامات حضور والدین در صفحه هر تجربه درج شده است.',
    },
    {
      q: 'شرایط کنسلی و استرداد وجه چیست؟',
      a: 'شرایط کنسلی بر اساس نوع نرخ انتخابی، تاریخ سفر و مناسبت متفاوت است. قبل از پرداخت، شرایط دقیق همان رزرو را می‌توانید مشاهده و تأیید کنید. اطلاعات کامل در سیاست کنسلی لوتکا موجود است.',
    },
    {
      q: 'آیا امکان رزرو ماساژ، یوگا و تجربه‌های دیگر وجود دارد؟',
      a: 'بله. خدمات سلامتی، ماساژ، یوگا، ATV و اسب‌سواری همه به صورت آنلاین قابل رزرو هستند. توصیه می‌شود این خدمات را همزمان با رزرو اقامتگاه یا قبل از ورود رزرو کنید تا ظرفیت دلخواه شما تضمین شود.',
    },
    {
      q: 'آیا پرداخت آنلاین امن است؟',
      a: 'بله. پرداخت از طریق درگاه بانکی معتبر و اتصال رمزگذاری‌شده انجام می‌شود. اطلاعات کامل کارت بانکی شما در سرورهای لوتکا ذخیره نمی‌شود.',
    },
  ],
  en: [
    {
      q: 'Where is Lootka and how do I get there?',
      a: 'Lootka is located in northern Iran in the Hyrcanian forest region. After your reservation is confirmed, you will receive the exact address, map link and detailed driving directions. Travel times from major cities are available on our Contact & Location page.',
    },
    {
      q: 'Which Lootka accommodations have private pools?',
      a: 'Approximately half of Lootka\'s units have private pools. Use the "Private pool" filter on the accommodations page. Each unit\'s page clearly states the pool type, heating system and seasons when the pool is available.',
    },
    {
      q: 'What are the check-in and check-out times?',
      a: 'Check-in and check-out times are shown on each accommodation page. Early check-in or late check-out may be possible depending on availability and with prior arrangement with Lootka reception.',
    },
    {
      q: 'Is Lootka suitable for families with children?',
      a: 'Yes. Lootka has a children\'s playground, animal garden, greenhouse and dedicated family experiences. Age requirements, activity hours and parental supervision requirements are noted on each experience page.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Cancellation conditions vary by rate type, travel date and season. You can review the exact terms for your specific booking before payment. Full details are available in Lootka\'s Cancellation Policy.',
    },
    {
      q: 'Can I book massage, yoga and other experiences?',
      a: 'Yes. Wellness services, massage, yoga, ATV and horse riding are all bookable online. We recommend booking experiences at the same time as your accommodation to guarantee your preferred capacity and schedule.',
    },
    {
      q: 'Is online payment secure?',
      a: 'Yes. All payments are processed through a verified banking gateway over an encrypted connection. Your full card details are not stored on Lootka\'s servers.',
    },
  ],
}

export default function FAQSection({ locale }: Props) {
  const isFa = locale === 'fa'
  const items = isFa ? FAQ_ITEMS.fa : FAQ_ITEMS.en
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section">
      <div className="container-content">
        <div className={cn('max-w-3xl', isFa ? 'me-auto text-end' : 'mx-auto')}>
          <p className="eyebrow mb-4">{isFa ? 'سوالات متداول' : 'FAQ'}</p>
          <h2 className={cn('text-headline text-white mb-8', isFa ? 'font-persian-display' : 'font-display')}>
            {isFa ? 'پاسخ به سوالات رایج' : 'Common questions answered'}
          </h2>

          <div className="divide-y divide-stone">
            {items.map((item, i) => (
              <div key={i}>
                <button
                  className={cn(
                    'w-full flex items-center justify-between gap-4 py-5 text-start',
                    isFa && 'flex-row-reverse text-end',
                  )}
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="text-body font-medium text-white">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'flex-shrink-0 text-forest-moss transition-transform duration-200',
                      open === i && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-hidden={open !== i}
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    open === i ? 'max-h-96 pb-5' : 'max-h-0',
                  )}
                >
                  <p className="text-body text-white/55 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href={`/${locale}/faq`} className="btn btn-outline-dark">
              {isFa ? 'مشاهده همه سوالات' : 'View all FAQs'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
