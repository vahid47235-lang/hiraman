import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HeroSection from '@/components/home/HeroSection'
import AvailabilitySearch from '@/components/booking/AvailabilitySearch'
import BrandPromise from '@/components/home/BrandPromise'
import AccommodationHighlights from '@/components/home/AccommodationHighlights'
import ExperiencesSection from '@/components/home/ExperiencesSection'
import WellnessSection from '@/components/home/WellnessSection'
import FamilySection from '@/components/home/FamilySection'
import AdventureSection from '@/components/home/AdventureSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import ResortMap from '@/components/home/ResortMap'
import PlatformLogos from '@/components/home/PlatformLogos'
import FAQSection from '@/components/home/FAQSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { generateOrganizationSchema, generateLodgingSchema } from '@/lib/structured-data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('siteName'),
    description: t('siteDescription'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(locale),
      generateLodgingSchema(locale),
    ],
  }

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection locale={locale} />
      <AvailabilitySearch locale={locale} />
      <BrandPromise locale={locale} />
      <AccommodationHighlights locale={locale} />
      <ExperiencesSection locale={locale} />
      <WellnessSection locale={locale} />
      <FamilySection locale={locale} />
      <AdventureSection locale={locale} />
      <ReviewsSection locale={locale} />
      <ResortMap locale={locale} />
      <PlatformLogos locale={locale} />
      <FAQSection locale={locale} />
      <NewsletterSection locale={locale} />
    </>
  )
}
