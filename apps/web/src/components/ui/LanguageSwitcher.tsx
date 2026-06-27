'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getLocaleHref } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Props = { locale: string; className?: string }

export default function LanguageSwitcher({ locale, className }: Props) {
  const t = useTranslations('nav')
  const pathname = usePathname()

  const targetLocale = locale === 'fa' ? 'en' : 'fa'
  const href = getLocaleHref(pathname, locale, targetLocale)

  return (
    <Link
      href={href}
      hrefLang={targetLocale}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium',
        'text-warm-ivory/70 hover:text-aged-brass transition-colors duration-200',
        'border border-warm-ivory/15 hover:border-aged-brass/40 rounded',
        className,
      )}
      aria-label={`Switch to ${targetLocale === 'en' ? 'English' : 'Persian'}`}
    >
      <span>{targetLocale === 'en' ? 'EN' : 'FA'}</span>
    </Link>
  )
}
