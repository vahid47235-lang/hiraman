import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return {
    title: locale === 'fa' ? 'رزرو اقامتگاه | لوتکا' : 'Reserve | LOOTKA',
    robots: { index: false, follow: false }, // booking pages must not be indexed
  }
}

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return children
}
