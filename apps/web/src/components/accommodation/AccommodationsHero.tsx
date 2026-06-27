'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function AccommodationsHero({ locale }: { locale: string }) {
  const isFa = locale === 'fa'
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play(); setPlaying(true) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !muted
    setMuted(!muted)
  }

  return (
    <section className="relative h-[60vh] min-h-[400px] max-h-[700px] bg-deep-forest overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/aghametgah.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/70 via-deep-forest/20 to-deep-forest/30" />

      {/* Text content */}
      <div className="absolute inset-0 flex items-end container-content pb-12 pt-20">
        <div>
          <p className="eyebrow mb-3">{isFa ? 'اقامتگاه‌ها' : 'Accommodations'}</p>
          <h1 className={`text-display text-warm-ivory ${isFa ? 'font-persian-display' : 'font-display'}`}>
            {isFa ? 'کلبه‌ها و ویلاهای ما' : 'Our Cabins & Villas'}
          </h1>
        </div>
      </div>

      {/* Video controls */}
      <div className="absolute bottom-5 end-5 flex gap-2 z-10">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full border border-warm-ivory/30 text-warm-ivory/70 hover:text-aged-brass hover:border-aged-brass/50 transition-all backdrop-blur-sm"
          aria-label={muted ? (isFa ? 'صدا روشن' : 'Unmute') : (isFa ? 'بی‌صدا' : 'Mute')}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button
          onClick={togglePlay}
          className="p-2.5 rounded-full border border-warm-ivory/30 text-warm-ivory/70 hover:text-aged-brass hover:border-aged-brass/50 transition-all backdrop-blur-sm"
          aria-label={playing ? (isFa ? 'توقف' : 'Pause') : (isFa ? 'پخش' : 'Play')}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    </section>
  )
}
