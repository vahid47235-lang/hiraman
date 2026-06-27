/**
 * JSON-LD structured data generators.
 * Only include information that is visible and accurate on the page.
 */

export function generateOrganizationSchema(locale: string) {
  return {
    '@type': 'Organization',
    '@id': 'https://lootka.ir/#organization',
    name: 'LOOTKA لوتکا',
    alternateName: locale === 'fa' ? 'لوتکا' : 'Lootka',
    url: `https://lootka.ir/${locale}`,
    logo: 'https://lootka.ir/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+989125584407',
      contactType: 'reservations',
      availableLanguage: ['fa', 'en'],
    },
    sameAs: [],
  }
}

export function generateLodgingSchema(locale: string) {
  return {
    '@type': 'LodgingBusiness',
    '@id': 'https://lootka.ir/#lodging',
    name: locale === 'fa' ? 'لوتکا — دهکده طبیعت، آرامش و ماجراجویی' : 'LOOTKA — Nature, Wellness & Adventure Resort',
    description:
      locale === 'fa'
        ? 'دهکده توریستی جنگلی با 17 واحد اقامتی لوکس، استخرهای اختصاصی، رستوران، کافه، برنامه‌های سلامتی و ماجراجویی در جنگل هیرکانی شمال ایران.'
        : 'Luxury forest tourism village with 17 accommodation units, private pools, restaurant, café, wellness and adventure experiences in the Hyrcanian forest of northern Iran.',
    url: `https://lootka.ir/${locale}`,
    telephone: '+989125584407',
    numberOfRooms: 17,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Private Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Café', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Yoga', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Massage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Horse Riding', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'ATV', value: true },
      { '@type': 'LocationFeatureSpecification', name: "Children's Playground", value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Animal Garden', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Greenhouse', value: true },
    ],
    starRating: {
      '@type': 'Rating',
      ratingValue: '5',
    },
  }
}

export function generateAccommodationSchema(unit: {
  name: string
  description: string
  areaM2: number
  maxGuests: number
  priceIRR: number
  imageUrl: string
  slug: string
  locale: string
}) {
  return {
    '@type': 'VacationRental',
    '@id': `https://lootka.ir/${unit.locale}/accommodations/${unit.slug}#unit`,
    name: unit.name,
    description: unit.description,
    floorSize: { '@type': 'QuantitativeValue', value: unit.areaM2, unitCode: 'MTK' },
    occupancy: { '@type': 'QuantitativeValue', minValue: 1, maxValue: unit.maxGuests },
    photo: { '@type': 'ImageObject', url: unit.imageUrl },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: unit.priceIRR,
      availability: 'https://schema.org/InStock',
    },
  }
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateBlogPostSchema(post: {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  imageUrl: string
  url: string
}) {
  return {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    image: post.imageUrl,
    url: post.url,
    publisher: {
      '@type': 'Organization',
      name: 'LOOTKA',
      logo: 'https://lootka.ir/images/logo.png',
    },
  }
}
