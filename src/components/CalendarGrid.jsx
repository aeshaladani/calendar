import React from 'react'
import { DAYS_OF_WEEK, HOLIDAYS } from '../utils/constants'
import { buildCalendarCells, getHoliday } from '../utils/dateUtils'
import s from './CalendarGrid.module.css'

function DayCell({ day, isToday, isWeekend, isStart, isEnd, isInRange, holiday, hasNote, hasTasks, onSelect, onDoubleClick }) {
  const [bouncing, setBouncing] = React.useState(false)
  if (day === null) return <div />
  const handleClick = () => {
    onSelect(day)
    setBouncing(true)
    setTimeout(() => setBouncing(false), 400)
  }
  const cls = [
    s.day,
    isToday    && s.today,
    isWeekend  && s.weekend,
    isStart    && s.start,
    isEnd      && s.end,
    isInRange  && s.inRange,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} onClick={() => onSelect(day)}
      role="button" tabIndex={0} onKeyDown={e => e.key==='Enter' && onSelect(day)}
      title={holiday || undefined}>
      <span className={s.num}>{day}</span>
      {holiday   && <span className={s.holidayDot} title={holiday} />}
      {hasTasks  && !isStart && !isEnd && <span className={s.taskDot} />}
      {hasNote   && !isStart && !isEnd && <span className={s.noteDot} />}
    </div>
  )
}

export default function CalendarGrid({ year, month, lo, hi, rangeStart, rangeEnd, notes, tasks, onSelect }) {
  const cells = buildCalendarCells(year, month)
  const today = new Date()
  const isCurrent = today.getFullYear()===year && today.getMonth()===month

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        {DAYS_OF_WEEK.map((d,i) => (
          <div key={d} className={`${s.dow} ${i>=5?s.wkDow:''}`}>{d}</div>
        ))}
      </div>
      <div className={s.grid}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const dow = i % 7
          const isStart  = lo != null && day === lo
          const isEnd    = hi != null && day === hi
          const isInRange= lo != null && hi != null && day > lo && day < hi
          const dayKey = `d-${year}-${month}-${day}`
          return (
            <DayCell key={day} day={day}
              isToday={isCurrent && today.getDate()===day}
              isWeekend={dow>=5}
              isStart={isStart} isEnd={isEnd} isInRange={isInRange}
              holiday={getHoliday(HOLIDAYS,month,day)}
              hasNote={!!(notes?.[dayKey]?.trim())}
              hasTasks={!!(tasks?.[dayKey]?.length)}
              onSelect={onSelect} />
          )
        })}
      </div>
      <div className={s.footer}>
        <span className={s.hint}>
          {!rangeStart ? 'Click a date to start selection'
            : !rangeEnd ? 'Click another date to complete range'
            : `${lo} – ${hi} selected`}
        </span>
      </div>
    </div>
  )
}
