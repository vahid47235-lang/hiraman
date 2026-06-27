import Image from 'next/image'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return { title: locale === 'fa' ? 'وبلاگ — هیرابان' : 'Blog — Hiraban' }
}

const posts = {
  fa: [
    { slug: '1', title: 'بهترین فصل برای سفر به هیرابان', date: '۱۴۰۳/۰۴/۱۵', cat: 'راهنمای سفر', img: 'blog-seasons', excerpt: 'هر فصل در هیرابان تجربه‌ای متفاوت ارائه می‌دهد. از شکوفه‌های بهاری تا برف‌های زمستانی، طبیعت هیرکانی همیشه شگفت‌انگیز است.' },
    { slug: '2', title: 'راهنمای کامل مسیرهای طبیعت‌گردی', date: '۱۴۰۳/۰۴/۰۲', cat: 'ماجراجویی', img: 'blog-hiking', excerpt: 'پنج مسیر پیاده‌روی منحصربه‌فرد در اطراف هیرابان که هر کدام با طبیعت و چشم‌اندازهای خیره‌کننده‌ای همراه هستند.' },
    { slug: '3', title: 'آشنایی با جنگل‌های هیرکانی', date: '۱۴۰۳/۰۳/۲۰', cat: 'طبیعت', img: 'blog-forest', excerpt: 'جنگل‌های هیرکانی یکی از قدیمی‌ترین اکوسیستم‌های زمین هستند. با ما در سفری به عمق این طبیعت بی‌نظیر همراه باشید.' },
    { slug: '4', title: 'تجربه اسپا و سلامتی در هیرابان', date: '۱۴۰۳/۰۳/۱۰', cat: 'سلامتی', img: 'blog-spa', excerpt: 'مرکز سلامتی هیرابان با ترکیب سنت‌های ایرانی و روش‌های مدرن، تجربه‌ای بی‌نظیر از آرامش و سلامتی ارائه می‌دهد.' },
    { slug: '5', title: 'آشپزی با گیاهان جنگلی', date: '۱۴۰۳/۰۲/۲۵', cat: 'غذا', img: 'blog-cooking', excerpt: 'آشپز رستوران هیرابان رازهای پخت غذاهای سنتی شمالی با گیاهان تازه جنگل را با ما در میان گذاشته است.' },
    { slug: '6', title: 'راهنمای عکاسی در جنگل', date: '۱۴۰۳/۰۲/۱۰', cat: 'هنر', img: 'blog-photo', excerpt: 'بهترین نکات و مکان‌ها برای عکاسی از طبیعت در جنگل‌های هیرکانی، همراه با راهنمایی‌های حرفه‌ای.' },
  ],
  en: [
    { slug: '1', title: 'Best season to visit Hiraban', date: 'July 6, 2024', cat: 'Travel Guide', img: 'blog-seasons', excerpt: 'Each season at Hiraban offers a different experience. From spring blossoms to winter snow, Hyrcanian nature is always breathtaking.' },
    { slug: '2', title: 'Complete guide to hiking trails', date: 'June 23, 2024', cat: 'Adventure', img: 'blog-hiking', excerpt: 'Five unique walking routes around Hiraban, each offering stunning nature and breathtaking views.' },
    { slug: '3', title: 'Getting to know the Hyrcanian forests', date: 'June 10, 2024', cat: 'Nature', img: 'blog-forest', excerpt: 'The Hyrcanian forests are among the oldest ecosystems on Earth. Join us on a journey into this extraordinary nature.' },
    { slug: '4', title: 'Spa & wellness experience at Hiraban', date: 'May 31, 2024', cat: 'Wellness', img: 'blog-spa', excerpt: "Hiraban's wellness centre blends Iranian traditions with modern methods to offer an unparalleled relaxation experience." },
    { slug: '5', title: 'Cooking with forest plants', date: 'May 16, 2024', cat: 'Food', img: 'blog-cooking', excerpt: "Hiraban's chef shares the secrets of cooking traditional northern dishes with fresh forest herbs." },
    { slug: '6', title: 'Photography guide in the forest', date: 'May 1, 2024', cat: 'Art', img: 'blog-photo', excerpt: 'Best tips and locations for nature photography in the Hyrcanian forests, with professional guidance.' },
  ],
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const isFa = locale === 'fa'
  const blogPosts = isFa ? posts.fa : posts.en

  return (
    <div className={isFa ? 'text-right' : 'text-left'}>
      <section className="relative h-64 md:h-80 bg-deep-forest overflow-hidden">
        <Image src="https://picsum.photos/seed/blog-hero/1920/600" alt="" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center container-content pt-16">
          <div>
            <p className="eyebrow mb-3">{isFa ? 'وبلاگ' : 'Blog'}</p>
            <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
              {isFa ? 'داستان‌ها و راهنماها' : 'Stories & Guides'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section bg-warm-ivory">
        <div className="container-content">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="card overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <Image src={`https://picsum.photos/seed/${post.img}/600/350`} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <div className={`flex items-center gap-3 mb-3 ${isFa ? 'flex-row-reverse' : ''}`}>
                    <span className="eyebrow">{post.cat}</span>
                    <span className="text-stone">·</span>
                    <span className="text-caption text-warm-gray num" dir="ltr">{post.date}</span>
                  </div>
                  <h2 className={`text-title font-medium text-charcoal mb-3 leading-snug ${isFa ? 'font-persian-display' : 'font-display'}`}>
                    {post.title}
                  </h2>
                  <p className="text-body-sm text-warm-gray leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="text-body-sm font-medium text-forest-moss hover:text-hiraban-pine transition-colors cursor-pointer">
                    {isFa ? 'ادامه مطلب ←' : 'Read more →'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
