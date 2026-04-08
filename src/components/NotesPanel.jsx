import React from 'react'
import { MONTHS } from '../utils/constants'
import { getDayCount } from '../utils/dateUtils'
import s from './NotesPanel.module.css'

export default function NotesPanel({ month, year, lo, hi, rangeStart, rangeEnd, notes, monthKey, onNoteChange, dayKey }) {
  const monthNote = notes[monthKey] || ''
  const hasRange  = rangeStart !== null
  const days      = hasRange ? getDayCount(lo, hi) : 0
  const dKey      = rangeStart != null ? dayKey(rangeStart) : null
  const dayNote   = dKey ? (notes[dKey]||'') : ''

  return (
    <div className={s.panel}>
      <p className={s.label}>Notes</p>
      <div className={s.padWrapper}>
        <div className={s.lines}>{Array.from({length:8}).map((_,i)=><div key={i} className={s.line}/>)}</div>
        <textarea className={s.ta} value={monthNote}
          onChange={e=>onNoteChange(monthKey,e.target.value)}
          placeholder={`${MONTHS[month]} notes…`} rows={8} />
      </div>

      {hasRange && (
        <div className={s.rangeBadge}>
          <p className={s.rangeTitle}>Selection</p>
          <p className={s.rangeVal}>
            {MONTHS[month]} {lo}{hi!==lo?` — ${hi}`:''} <span className={s.daysSpan}>· {days} day{days!==1?'s':''}</span>
          </p>
          <textarea className={s.dayNote} value={dayNote}
            onChange={e=>onNoteChange(dKey,e.target.value)}
            placeholder={`Note for ${MONTHS[month]} ${lo}…`} rows={2} />
        </div>
      )}

      <div className={s.legend}>
        <LI color="var(--accent)" label="Weekend" />
        <LI color="var(--red)"    label="Holiday" />
        <LI color="var(--accent)" label="Task" dot />
        <LI color="var(--amber)"  label="Note" dot />
      </div>
    </div>
  )
}

function LI({ color, label, dot }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:5,fontSize:10,color:'var(--text-3)'}}>
      <span style={{width:dot?5:9,height:dot?5:9,borderRadius:'50%',background:color,flexShrink:0,display:'inline-block'}}/>
      {label}
    </div>
  )
}
