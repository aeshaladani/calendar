import React from 'react'
import s from './ViewTabs.module.css'

const TABS = [
  { id: 'month',  label: 'Month',  icon: '▦' },
  { id: 'week',   label: 'Week',   icon: '▤' },
  { id: 'day',    label: 'Day',    icon: '▣' },
]

export default function ViewTabs({ active, onChange }) {
  return (
    <div className={s.tabs} role="tablist">
      {TABS.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`${s.tab} ${active === t.id ? s.active : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className={s.icon}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  )
}
