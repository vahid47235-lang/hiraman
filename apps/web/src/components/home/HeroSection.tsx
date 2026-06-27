'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Play, Pause, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  locale: string
}

export default function HeroSection({ locale }: Props) {
  const t = useTranslations('hero')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play(); setPlaying(true) }
  }

  const localePath = (href: string) => `/${locale}${href}`
  const isFa = locale === 'fa'

  return (
    <section
      className="relative w-full h-screen min-h-[600px] max-h-[1080px] overflow-hidden bg-deep-forest"
      aria-label={isFa ? 'هیرابان — دهکده طبیعت و ماجراجویی' : 'HIRABAN — Nature, Wellness & Adventure Resort'}
    >
      {/* Video / Fallback poster */}
      {!prefersReducedMotion ? (
        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
            videoLoaded ? 'opacity-100' : 'opacity-0',
          )}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          preload="none"
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
        >
          {/* Mobile version — smaller file */}
          <source
            src="/videos/hero-mobile.webm"
            type="video/webm"
            media="(max-width: 768px)"
          />
          <source
            src="/videos/hero-mobile.mp4"
            type="video/mp4"
            media="(max-width: 768px)"
          />
          {/* Desktop */}
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Poster image (always shown until video loads, or when motion disabled) */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          videoLoaded && !prefersReducedMotion ? 'opacity-0' : 'opacity-100',
        )}
      >
        <Image
          src="https://picsum.photos/seed/forest-hero/1920/1080"
          alt={t('video_alt')}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-overlay-strong" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(11,26,19,0.6) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full container-content pt-[var(--nav-height)]">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="eyebrow mb-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {isFa ? 'هیرابان — هیرکانی، ایران' : 'HIRABAN — Hyrcanian Forest, Iran'}
          </p>

          {/* Main headline */}
          <h1
            className={cn(
              'text-display text-warm-ivory mb-6 animate-fade-up',
              isFa ? 'font-persian-display' : 'font-display',
            )}
            style={{ animationDelay: '350ms' }}
          >
            {t('tagline')}
          </h1>

          {/* Description */}
          <p
            className="text-body-lg text-warm-ivory/75 mb-10 max-w-lg leading-relaxed animate-fade-up"
            style={{ animationDelay: '500ms' }}
          >
            {t('description')}
          </p>

          {/* CTAs */}
          <div
            className={cn(
              'flex flex-wrap gap-4 animate-fade-up',
              isFa ? 'flex-row-reverse justify-end' : 'flex-row',
            )}
            style={{ animationDelay: '650ms' }}
          >
            <Link
              href={localePath('/accommodations')}
              className="btn btn-primary btn-lg"
            >
              {t('cta_primary')}
            </Link>
            <Link
              href={localePath('/experiences')}
              className="btn btn-secondary btn-lg"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </div>

      {/* Video controls */}
      {!prefersReducedMotion && (
        <button
          onClick={togglePlay}
          className="absolute bottom-8 end-6 z-10 p-3 rounded-full border border-warm-ivory/30 text-warm-ivory/70 hover:text-aged-brass hover:border-aged-brass/50 transition-all duration-200 backdrop-blur-sm"
          aria-label={playing ? t('video_pause') : t('video_play')}
          aria-pressed={playing}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      {/* Scroll indicator */}
      <button
        onClick={() => {
          document.getElementById('availability-search')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-8 start-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-warm-ivory/40 hover:text-aged-brass transition-colors duration-200"
        aria-label={t('scroll')}
      >
        <span className="text-caption tracking-widest uppercase">{t('scroll')}</span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>

      {/* Stats strip */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <div className="container-content">
          <div
            className={cn(
              'glass rounded-t-xl px-6 py-4 flex gap-8',
              isFa ? 'flex-row-reverse' : 'flex-row',
            )}
          >
            {[
              {
                label: isFa ? 'واحد اقامتی' : 'Accommodations',
                value: '17',
              },
              {
                label: isFa ? 'متر مربع' : 'm² Resort',
                value: '14,000',
              },
              {
                label: isFa ? 'تجربه منحصربه‌فرد' : 'Experiences',
                value: '12+',
              },
              {
                label: isFa ? 'اقامتی لوکس با استخر اختصاصی' : 'Luxury stays with private pool',
                value: isFa ? '۸' : '8',
              },
            ].map((stat) => (
              <div key={stat.label} className="hidden sm:block">
                <div
                  className="num text-aged-brass font-display text-xl font-medium"
                  dir="ltr"
                >
                  {stat.value}
                </div>
                <div className="text-warm-ivory/50 text-caption mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
