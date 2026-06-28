'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import LootkaLogo from '@/components/ui/LootkaLogo'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

type NavItem = {
  key: string
  href: string
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  { key: 'accommodations', href: '/accommodations' },
  {
    key: 'experiences', href: '/experiences',
    children: [
      { key: 'wellness', href: '/wellness' },
      { key: 'family', href: '/family' },
      { key: 'adventure', href: '/adventure' },
      { key: 'restaurant', href: '/restaurant' },
    ],
  },
  { key: 'packages', href: '/packages' },
  { key: 'reviews', href: '/reviews' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
]

type HeaderProps = { locale: string }

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const localePath = (href: string) => `/${locale}${href}`

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 inset-x-0 z-nav transition-all duration-400',
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/8'
            : 'bg-transparent',
        )}
        style={{ height: 'var(--nav-height)' }}
      >
        <div className="container-content h-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href={localePath('/')}
            aria-label="LOOTKA — برگشت به صفحه اصلی"
            className="flex-shrink-0"
          >
            <LootkaLogo locale={locale} variant="light" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav
            role="navigation"
            aria-label={locale === 'fa' ? 'منوی اصلی' : 'Main navigation'}
            className="hidden lg:flex items-center gap-1"
            ref={dropdownRef}
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.key} className="relative">
                {item.children ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium text-warm-ivory/80 hover:text-aged-brass transition-colors duration-200 rounded',
                      activeDropdown === item.key && 'text-aged-brass',
                    )}
                    onClick={() => setActiveDropdown(activeDropdown === item.key ? null : item.key)}
                    aria-expanded={activeDropdown === item.key}
                    aria-haspopup="true"
                  >
                    {t(item.key)}
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        activeDropdown === item.key && 'rotate-180',
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={localePath(item.href)}
                    className={cn(
                      'px-3 py-2 text-sm font-medium text-warm-ivory/80 hover:text-aged-brass transition-colors duration-200 rounded',
                      pathname.startsWith(localePath(item.href)) && 'text-aged-brass',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && activeDropdown === item.key && (
                  <div
                    className="absolute top-full mt-1 py-2 w-48 bg-black/95 border border-white/10 rounded-lg shadow-xl"
                    style={{ insetInlineStart: 0 }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={localePath(child.href)}
                        className="block px-4 py-2.5 text-sm text-warm-ivory/80 hover:text-aged-brass hover:bg-white/8 transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <Link
              href={localePath('/contact')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-warm-ivory/70 hover:text-aged-brass transition-colors"
            >
              {t('contact' as 'reserve')}
            </Link>
            <Link
              href={localePath('/reserve')}
              className="btn btn-primary btn-sm hidden sm:inline-flex"
            >
              {t('reserve')}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-warm-ivory hover:text-aged-brass transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t('close') : t('menu')}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'fa' ? 'منوی موبایل' : 'Mobile menu'}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-lootka-pine">
            <Link href={localePath('/')} onClick={() => setMobileOpen(false)}>
              <LootkaLogo locale={locale} variant="light" className="h-9" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-warm-ivory hover:text-aged-brass"
              aria-label={t('close')}
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.key}>
                {item.children ? (
                  <>
                    <div className="py-3 text-sm font-semibold text-white/55 uppercase tracking-widest">
                      {t(item.key)}
                    </div>
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={localePath(child.href)}
                        className={cn(
                          'block py-3 ps-4 text-base text-warm-ivory/80 hover:text-aged-brass transition-colors border-b border-white/8',
                          pathname.startsWith(localePath(child.href)) && 'text-aged-brass',
                        )}
                      >
                        {t(child.key)}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={localePath(item.href)}
                    className={cn(
                      'block py-3 text-base text-warm-ivory/80 hover:text-aged-brass transition-colors border-b border-white/8',
                      pathname.startsWith(localePath(item.href)) && 'text-aged-brass',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="px-5 py-6 space-y-3 border-t border-white/10">
            <Link
              href={localePath('/reserve')}
              className="btn btn-primary w-full"
              onClick={() => setMobileOpen(false)}
            >
              {t('reserve')}
            </Link>
            <div className="flex justify-center">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
