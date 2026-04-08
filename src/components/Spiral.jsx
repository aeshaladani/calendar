import React from 'react'
import s from './Spiral.module.css'
export default function Spiral({ count = 22 }) {
  return (
    <div className={s.row}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={s.coil}><div className={s.stem} /></div>
      ))}
    </div>
  )
}
