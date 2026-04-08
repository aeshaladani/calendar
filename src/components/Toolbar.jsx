import React from 'react'
import { THEMES } from '../utils/constants'
import s from './Toolbar.module.css'

export default function Toolbar({ themeIdx, setThemeIdx, hasRange, onClear }) {
  return (
    <div className={s.bar}>
      <div className={s.themes}>
        <span className={s.tLabel}>Theme</span>
        {THEMES.map((t,i)=>(
          <button key={t.name} className={`${s.dot} ${i===themeIdx?s.active:''}`}
            style={{background:t.dot}} title={t.name} onClick={()=>setThemeIdx(i)}
            aria-label={t.name} />
        ))}
      </div>
      <div className={s.right}>
        {hasRange && (
          <button className={s.clear} onClick={onClear}>Clear ✕</button>
        )}
      </div>
    </div>
  )
}
