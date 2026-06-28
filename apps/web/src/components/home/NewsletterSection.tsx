'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Props = { locale: string }

export default function NewsletterSection({ locale }: Props) {
  const isFa = locale === 'fa'
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || !email) return
    setStatus('loading')
    try {
      // Replace with real API call
      await new Promise((r) => setTimeout(r, 1000))
      setStatus('success')
      setEmail('')
      setConsent(false)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section">
      <div className="container-content">
        <div className="max-w-xl mx-auto text-center">
          <p className="eyebrow mb-4">{isFa ? 'خبرنامه' : 'Newsletter'}</p>
          <h2 className={cn('text-headline mb-4', isFa ? 'font-persian-display' : 'font-display')}>
            {isFa ? 'با لوتکا در ارتباط باشید' : 'Stay connected with Lootka'}
          </h2>
          <p className="text-body text-white/55 mb-8">
            {isFa
              ? 'از پیشنهادهای ویژه، فصل‌های جدید و تجربه‌های جدید اول مطلع شوید.'
              : 'Be first to hear about special offers, seasonal highlights and new experiences.'}
          </p>

          {status === 'success' ? (
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white font-medium">
                {isFa ? '✓ عضویت شما با موفقیت ثبت شد.' : '✓ You\'ve subscribed successfully.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFa ? 'ایمیل شما' : 'Your email address'}
                  required
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-aged-brass focus:bg-white/15 transition-all num"
                  dir="ltr"
                  aria-label={isFa ? 'آدرس ایمیل' : 'Email address'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || !consent || !email}
                  className="btn btn-primary whitespace-nowrap"
                >
                  {status === 'loading'
                    ? (isFa ? 'در حال ثبت...' : 'Subscribing...')
                    : (isFa ? 'عضویت' : 'Subscribe')}
                </button>
              </div>

              {/* Consent checkbox — required for GDPR/PECR compliance */}
              <label className={cn('flex items-start gap-2 text-start cursor-pointer')} dir={isFa ? 'rtl' : undefined}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-aged-brass"
                  required
                />
                <span className="text-caption text-warm-ivory/60">
                  {isFa
                    ? 'موافقت می‌کنم که لوتکا ایمیل‌های خبرنامه برای من ارسال کند. هر زمان می‌توانم اشتراک را لغو کنم.'
                    : 'I agree to receive Lootka\'s newsletter emails. I can unsubscribe at any time.'}
                </span>
              </label>

              {status === 'error' && (
                <p className="mt-3 text-natural-clay text-caption">
                  {isFa ? 'خطا در ثبت. لطفاً دوباره تلاش کنید.' : 'Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
