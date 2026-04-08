import React, { useState } from 'react'
import { MONTHS, HERO_IMAGES } from '../utils/constants'
import s from './HeroSection.module.css'

export default function HeroSection({ month, year, onPrev, onNext }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={s.hero}>
      <img key={month} src={HERO_IMAGES[month]} alt={MONTHS[month]}
        className={s.photo} style={{ opacity: loaded ? 0.5 : 0 }}
        onLoad={() => setLoaded(true)} onError={() => setLoaded(false)} />
      <svg className={s.shapes} viewBox="0 0 900 230" preserveAspectRatio="none">
        <polygon points="0,230 0,120 260,230" fill="var(--grad-a)" opacity=".8" />
        <polygon points="0,230 0,178 140,230" fill="var(--grad-b)" opacity=".65" />
      </svg>
      <div className={s.title}>
        <span className={s.year}>{year}</span>
        <span className={s.name}>{MONTHS[month].toUpperCase()}</span>
      </div>
      <div className={s.nav}>
        <button className={s.btn} onClick={onPrev} aria-label="Previous month">‹</button>
        <button className={s.btn} onClick={onNext} aria-label="Next month">›</button>
      </div>
    </div>
  )
}
