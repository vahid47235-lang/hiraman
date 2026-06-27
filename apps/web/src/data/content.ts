// Central site content — edited via admin panel at /admin
// Images use picsum.photos for dev (consistent, seed-based). Replace with CDN URLs in production.

function img(seed: string, w = 1200, h = 800) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

export type SiteContent = typeof defaultContent

const defaultContent = {
  hero: {
    backgroundImage: img('forest-hero', 1920, 1080),
    posterImage: img('forest-hero', 800, 450),
    videoUrl: '', // leave empty to show image fallback
  },

  accommodations: [
    {
      id: 'cabin-63-a',
      slug: 'forest-cabin-63',
      nameEn: 'Forest Cabin',
      nameFa: 'کلبه جنگلی',
      categoryEn: 'Forest Cabin 63m²',
      categoryFa: 'کلبه جنگلی ۶۳ متری',
      descEn: 'A lovingly crafted stone-and-timber cabin nestled among ancient oaks. Features a wood-burning fireplace, wrap-around terrace and direct forest access.',
      descFa: 'کلبه‌ای دلنشین از سنگ و چوب در میان بلوط‌های کهنسال. دارای شومینه هیزمی، تراس محیطی و دسترسی مستقیم به جنگل.',
      areaM2: 63,
      maxGuests: 4,
      bedrooms: 1,
      hasPrivatePool: false,
      startingPriceIRR: 4500000,
      imageUrl: img('cabin-forest-63', 800, 600),
      imageAlt: 'Cozy forest cabin surrounded by ancient trees',
      rating: 4.8,
      reviewCount: 34,
      availability: 'available' as const,
      instantConfirm: true,
      amenitiesEn: ['Wi-Fi', 'Fireplace', 'Terrace', 'BBQ'],
      amenitiesFa: ['وای‌فای', 'شومینه', 'تراس', 'باربیکیو'],
    },
    {
      id: 'cabin-75-pool',
      slug: 'cabin-75-pool',
      nameEn: 'Forest Cabin with Pool',
      nameFa: 'کلبه جنگلی با استخر',
      categoryEn: 'Forest Cabin 75m²',
      categoryFa: 'کلبه جنگلی ۷۵ متری',
      descEn: 'A serene two-bedroom cabin with a heated private pool overlooking the forest canopy. Perfect for couples or small families seeking complete privacy.',
      descFa: 'کلبه‌ای آرام با دو اتاق خواب و استخر گرم اختصاصی با دید به سقف جنگل. ایده‌آل برای زوج‌ها یا خانواده‌های کوچک.',
      areaM2: 75,
      maxGuests: 4,
      bedrooms: 2,
      hasPrivatePool: true,
      poolTypeEn: 'Heated private pool',
      poolTypeFa: 'استخر گرم اختصاصی',
      startingPriceIRR: 7200000,
      imageUrl: img('cabin-pool-75', 800, 600),
      imageAlt: 'Forest cabin with private infinity pool',
      rating: 4.9,
      reviewCount: 28,
      availability: 'limited' as const,
      instantConfirm: true,
      amenitiesEn: ['Private pool', 'Wi-Fi', 'Fireplace', 'Terrace'],
      amenitiesFa: ['استخر اختصاصی', 'وای‌فای', 'شومینه', 'تراس'],
    },
    {
      id: 'villa-128-a',
      slug: 'forest-villa-128',
      nameEn: 'Forest Villa',
      nameFa: 'ویلای جنگلی',
      categoryEn: 'Forest Villa 128m²',
      categoryFa: 'ویلای جنگلی ۱۲۸ متری',
      descEn: 'A three-bedroom luxury villa with a heated private pool, full gourmet kitchen and panoramic forest terrace. The ultimate Lootka retreat for families.',
      descFa: 'ویلای لوکس سه‌خوابه با استخر گرم اختصاصی، آشپزخانه کامل و تراس جنگلی پانوراما. بهترین انتخاب برای خانواده‌ها.',
      areaM2: 128,
      maxGuests: 8,
      bedrooms: 3,
      hasPrivatePool: true,
      poolTypeEn: 'Heated private pool',
      poolTypeFa: 'استخر گرم اختصاصی',
      startingPriceIRR: 14000000,
      imageUrl: img('forest-villa-128', 800, 600),
      imageAlt: 'Luxury forest villa with private pool and terrace',
      rating: 4.9,
      reviewCount: 19,
      availability: 'available' as const,
      instantConfirm: false,
      amenitiesEn: ['Private pool', 'Full kitchen', 'Wi-Fi', 'BBQ'],
      amenitiesFa: ['استخر اختصاصی', 'آشپزخانه کامل', 'وای‌فای', 'باربیکیو'],
    },
  ],

  experiences: [
    {
      key: 'wellness',
      titleEn: 'Forest Spa & Wellness',
      titleFa: 'اسپا و سلامت جنگلی',
      descEn: 'Immersive spa treatments using local forest botanicals, stone therapy and cold-spring hydrotherapy in the heart of the Hyrcanian wilderness.',
      descFa: 'درمان‌های اسپا با گیاهان محلی جنگل، سنگ درمانی و آب‌درمانی با چشمه طبیعی در دل جنگل هیرکانی.',
      href: '/wellness',
      image: img('spa-stone', 800, 1000),
      imageAlt: 'Stone hot tub surrounded by forest',
    },
    {
      key: 'adventure',
      titleEn: 'Mountain & Trail Adventure',
      titleFa: 'ماجراجویی کوه و مسیر',
      descEn: 'Guided ATV tours through ancient forest trails, zip-lining above the canopy and multi-day trekking with local mountain guides.',
      descFa: 'تور ATV هدایت‌شده در مسیرهای جنگلی کهن، زیپ‌لاین بالای سقف جنگل و ترکینگ چندروزه با راهنماهای بومی.',
      href: '/adventure',
      image: img('atv-trail', 800, 500),
      imageAlt: 'ATV trail through mountain forest',
    },
    {
      key: 'family',
      titleEn: 'Family & Children',
      titleFa: 'خانواده و کودکان',
      descEn: "Animal garden, greenhouse activities and a safe children's playground supervised by trained nature educators.",
      descFa: 'باغ حیوانات، فعالیت‌های گلخانه‌ای و زمین بازی ایمن کودکان زیر نظر مربیان آموزش دیده طبیعت.',
      href: '/family',
      image: img('family-forest', 800, 500),
      imageAlt: 'Family exploring nature at Lootka',
    },
    {
      key: 'dining',
      titleEn: 'Forest Restaurant & Café',
      titleFa: 'رستوران و کافه جنگلی',
      descEn: 'Seasonal menus rooted in northern Iranian cuisine — fresh herbs from our garden, local trout from mountain streams and wood-fired flatbreads.',
      descFa: 'منوهای فصلی الهام گرفته از آشپزی شمال ایران — گیاهان تازه از باغ ما، قزل‌آلای محلی از رودخانه‌های کوهستانی.',
      href: '/restaurant',
      image: img('restaurant-table', 800, 500),
      imageAlt: 'Lootka forest restaurant with open kitchen',
    },
  ],

  wellness: {
    image: img('outdoor-spa', 800, 1000),
    imageAlt: 'Outdoor forest spa terrace at Lootka',
    servicesEn: ['Forest Aroma Massage', 'Hot Stone Therapy', 'Cold Spring Immersion', 'Sunrise Yoga', 'Sound Bath', 'Herbal Steam Room'],
    servicesFa: ['ماساژ آروما جنگلی', 'سنگ درمانی گرم', 'غوطه‌وری آب سرد', 'یوگای طلوع آفتاب', 'حمام صوتی', 'اتاق بخار گیاهی'],
  },

  family: {
    collageImages: [
      { src: img('family-forest', 600, 900), alt: 'Children exploring the forest' },
      { src: img('kids-garden', 600, 500), alt: 'Family activities at Lootka' },
      { src: img('greenhouse-nature', 600, 500), alt: 'Nature play area for children' },
    ],
    highlightsEn: ['Animal garden with 20+ local species', 'Guided forest walks for all ages', 'Organic greenhouse and cooking class', 'Pottery and craft workshop', 'Star-gazing nights with telescope'],
    highlightsFa: ['باغ حیوانات با بیش از ۲۰ گونه بومی', 'گشت‌های جنگلی هدایت‌شده برای همه سنین', 'گلخانه ارگانیک و کلاس آشپزی', 'کارگاه سفالگری و صنایع دستی', 'شب‌های ستاره‌بینی با تلسکوپ'],
  },

  adventure: {
    atvImage: img('atv-trail', 900, 600),
    atvAlt: 'ATV riding through Lootka forest trails',
    horseImage: img('horse-riding', 900, 600),
    horseAlt: 'Horse riding through the Hyrcanian forest',
  },

  reviews: [
    {
      id: 'r1',
      rating: 5,
      textEn: "One of the most special places we've ever stayed. The private pool cabin is extraordinary — complete silence except for birdsong. We've already booked our return.",
      textFa: 'یکی از خاص‌ترین جاهایی که تا به حال در آن اقامت داشتیم. کلبه استخر اختصاصی فوق‌العاده است — سکوت مطلق جز صدای پرندگان. قبلاً برای بازگشت رزرو کرده‌ایم.',
      authorEn: 'Maryam & Dariush K.',
      authorFa: 'مریم و داریوش ک.',
      locationEn: 'Tehran',
      locationFa: 'تهران',
      stayType: 'cabin-75-pool',
      date: '2024-10',
      avatarUrl: img('avatar-1', 80, 80),
    },
    {
      id: 'r2',
      rating: 5,
      textEn: "Brought the whole family — three generations, twelve people. Every single one of us loved it. The children were mesmerised by the animal garden and the food was outstanding.",
      textFa: 'کل خانواده را آوردیم — سه نسل، دوازده نفر. همه ما آن را دوست داشتیم. بچه‌ها شیفته باغ حیوانات بودند و غذا فوق‌العاده بود.',
      authorEn: 'Farshid Rahimi',
      authorFa: 'فرشید رحیمی',
      locationEn: 'Isfahan',
      locationFa: 'اصفهان',
      stayType: 'villa-128-a',
      date: '2024-09',
      avatarUrl: img('avatar-2', 80, 80),
    },
    {
      id: 'r3',
      rating: 5,
      textEn: "The forest spa is unlike anything in Iran. The hot-stone treatment followed by the cold spring pool is genuinely transformative. We stayed for 5 nights and it still wasn't enough.",
      textFa: 'اسپای جنگلی با هیچ‌جایی در ایران قابل مقایسه نیست. درمان سنگ گرم و بعد استخر آب سرد واقعاً تحول‌آفرین است. ۵ شب ماندیم و باز هم کافی نبود.',
      authorEn: 'Shirin Mohammadi',
      authorFa: 'شیرین محمدی',
      locationEn: 'Mashhad',
      locationFa: 'مشهد',
      stayType: 'cabin-63-a',
      date: '2024-08',
      avatarUrl: img('avatar-3', 80, 80),
    },
  ],

  faq: [
    {
      id: 'f1',
      questionEn: 'How far is Lootka from Tehran?',
      questionFa: 'فاصله لوتکا تا تهران چقدر است؟',
      answerEn: 'Lootka is approximately 140 km from Tehran — about 2.5 to 3 hours by car via the Chalus road (Route 59). We recommend departing early to enjoy the scenic mountain drive.',
      answerFa: 'لوتکا تقریباً ۱۴۰ کیلومتر از تهران فاصله دارد — حدود ۲.۵ تا ۳ ساعت با ماشین از جاده چالوس. توصیه می‌کنیم صبح زود حرکت کنید تا از مسیر کوهستانی زیبا لذت ببرید.',
    },
    {
      id: 'f2',
      questionEn: 'What is the best season to visit?',
      questionFa: 'بهترین فصل برای بازدید کدام است؟',
      answerEn: 'Lootka is beautiful year-round. Spring (Nowruz season) brings wildflowers and fresh greenery. Summer is warm and perfect for the pools. Autumn turns the forest gold. Winter offers snow-covered cabins and fireside evenings.',
      answerFa: 'لوتکا در تمام فصول زیباست. بهار (فصل نوروز) گل‌های وحشی و سبزی تازه می‌آورد. تابستان گرم و عالی برای استخرها است. پاییز جنگل را طلایی می‌کند. زمستان کلبه‌های برف‌پوش و شب‌های کنار شومینه دارد.',
    },
    {
      id: 'f3',
      questionEn: 'Are pets allowed?',
      questionFa: 'آیا حیوانات خانگی مجاز هستند؟',
      answerEn: 'Yes — well-behaved dogs are welcome in our Forest Cabin units at no extra charge. We ask that pets remain off furniture and out of the private pool. Please inform us at booking.',
      answerFa: 'بله — سگ‌های مؤدب در واحدهای کلبه جنگلی ما بدون هزینه اضافی خوش آمدند. خواهشمندیم حیوانات خانگی روی مبلمان و داخل استخر اختصاصی نباشند. لطفاً هنگام رزرو اطلاع دهید.',
    },
    {
      id: 'f4',
      questionEn: 'Is there Wi-Fi at the cabins?',
      questionFa: 'آیا در کلبه‌ها وای‌فای وجود دارد؟',
      answerEn: 'Yes, all units have high-speed Wi-Fi. That said, many guests deliberately disconnect to immerse themselves in the forest experience — which we gently encourage.',
      answerFa: 'بله، همه واحدها وای‌فای پرسرعت دارند. با این حال، بسیاری از مهمانان عمداً قطع ارتباط می‌کنند تا خود را در تجربه جنگلی غرق کنند — که ما آن را با ملایمت تشویق می‌کنیم.',
    },
    {
      id: 'f5',
      questionEn: 'What is the cancellation policy?',
      questionFa: 'سیاست لغو رزرو چیست؟',
      answerEn: 'Cancel up to 7 days before check-in for a full refund. 3–7 days before: 50% refund. Less than 3 days or no-show: no refund. During peak season (Nowruz, summer), cancellations must be made 14 days in advance for a full refund.',
      answerFa: 'لغو تا ۷ روز قبل از ورود: استرداد کامل. ۳ تا ۷ روز قبل: استرداد ۵۰٪. کمتر از ۳ روز یا عدم حضور: بدون استرداد. در اوج فصل (نوروز، تابستان)، لغو باید ۱۴ روز قبل برای استرداد کامل انجام شود.',
    },
    {
      id: 'f6',
      questionEn: 'Do you offer airport/city transfers?',
      questionFa: 'آیا سرویس انتقال فرودگاه/شهر دارید؟',
      answerEn: 'Yes — we offer private transfer service from Tehran (Imam Khomeini or Mehrabad airports) and from Karaj city centre. Rates start from 2,500,000 IRR each way. Book at least 48 hours in advance.',
      answerFa: 'بله — سرویس انتقال خصوصی از تهران (فرودگاه‌های امام خمینی یا مهرآباد) و از مرکز شهر کرج ارائه می‌دهیم. نرخ‌ها از ۲٬۵۰۰٬۰۰۰ تومان یک‌طرفه شروع می‌شود. حداقل ۴۸ ساعت قبل رزرو کنید.',
    },
    {
      id: 'f7',
      questionEn: 'Can I arrange a surprise or special occasion?',
      questionFa: 'آیا می‌توانم مراسم غافلگیری یا مناسبت خاصی ترتیب دهم؟',
      answerEn: 'Absolutely. Our concierge team specialises in anniversary setups, marriage proposals, birthday arrangements and baby showers. Contact us at least 72 hours in advance to discuss your vision.',
      answerFa: 'قطعاً. تیم کنسیرژ ما در چیدمان سالگرد، پروپوزال، تزئینات تولد و جشن بارداری تخصص دارد. حداقل ۷۲ ساعت قبل با ما تماس بگیرید تا درباره ایده‌هایتان صحبت کنیم.',
    },
  ],

  contact: {
    phone: '+98 912 558 4407',
    whatsapp: '989125584407',
    email: 'stay@lootka.ir',
    addressEn: 'Lootka Forest Resort, Chalus Road, Alborz Province, Iran',
    addressFa: 'دهکده جنگلی لوتکا، جاده چالوس، استان البرز، ایران',
    googleMapsEmbed: 'https://maps.google.com/maps?q=36.2,51.3&z=12&output=embed',
    coordinates: { lat: 36.2, lng: 51.3 },
    receptionHoursEn: 'Daily 8:00 AM – 10:00 PM',
    receptionHoursFa: 'روزانه ۸:۰۰ صبح تا ۱۰:۰۰ شب',
  },
}

export default defaultContent

// Runtime content loader — reads from /data/content.override.json if it exists,
// falls back to default. Admin panel writes to the override file.
let _content: SiteContent | null = null

export async function getContent(): Promise<SiteContent> {
  if (_content) return _content
  try {
    const { promises: fs } = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'src', 'data', 'content.override.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    _content = JSON.parse(raw) as SiteContent
  } catch {
    _content = defaultContent
  }
  return _content
}

export function invalidateContent() {
  _content = null
}
