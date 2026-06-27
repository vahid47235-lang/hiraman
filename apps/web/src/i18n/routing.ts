import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fa', 'en'],
  defaultLocale: 'fa',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/accommodations': {
      fa: '/aghametgah',
      en: '/accommodations',
    },
    '/accommodations/[slug]': {
      fa: '/aghametgah/[slug]',
      en: '/accommodations/[slug]',
    },
    '/experiences': {
      fa: '/tajrobeh',
      en: '/experiences',
    },
    '/packages': {
      fa: '/basteh',
      en: '/packages',
    },
    '/wellness': {
      fa: '/salamat',
      en: '/wellness',
    },
    '/family': {
      fa: '/khanevadeh',
      en: '/family',
    },
    '/adventure': {
      fa: '/majarajouyi',
      en: '/adventure',
    },
    '/restaurant': {
      fa: '/restoron',
      en: '/restaurant',
    },
    '/reviews': {
      fa: '/nazarat',
      en: '/reviews',
    },
    '/blog': {
      fa: '/blog',
      en: '/blog',
    },
    '/about': {
      fa: '/darbareh',
      en: '/about',
    },
    '/contact': {
      fa: '/tamase',
      en: '/contact',
    },
    '/faq': {
      fa: '/soalat',
      en: '/faq',
    },
    '/reserve': {
      fa: '/rezerv',
      en: '/reserve',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
