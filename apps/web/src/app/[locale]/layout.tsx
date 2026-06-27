import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import CookieConsent from '@/components/layout/CookieConsent'
import { Analytics } from '@/components/Analytics'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const isRtl = locale === 'fa'
  const canonical = `https://hiraban.ir/${locale}`

  return {
    title: t('siteName'),
    description: t('siteDescription'),
    alternates: {
      canonical,
      languages: {
        fa: 'https://hiraban.ir/fa',
        en: 'https://hiraban.ir/en',
        'x-default': 'https://hiraban.ir/fa',
      },
    },
    openGraph: {
      locale: isRtl ? 'fa_IR' : 'en_US',
      alternateLocale: isRtl ? 'en_US' : 'fa_IR',
      siteName: 'HIRABAN هیرابان',
      type: 'website',
    },
    other: {
      'theme-color': '#0B1A13',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fa' | 'en')) {
    notFound()
  }

  const messages = await getMessages()
  const dir = locale === 'fa' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=Markazi+Text:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[500] btn btn-primary">
            {locale === 'fa' ? 'رفتن به محتوای اصلی' : 'Skip to main content'}
          </a>
          <Header locale={locale} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
          <FloatingActions locale={locale} />
          <CookieConsent locale={locale} />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
