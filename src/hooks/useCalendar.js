import { useState, useCallback } from 'react'
import { normaliseRange } from '../utils/dateUtils'
import { load, save } from '../utils/storage'

export function useCalendar(initYear, initMonth) {
  const [year, setYear]   = useState(initYear)
  const [month, setMonth] = useState(initMonth)
  const [rangeStart, setRS] = useState(null)
  const [rangeEnd,   setRE] = useState(null)
  const [selecting,  setSel] = useState(false)

  // Notes: key → string  (month notes: "m-YYYY-M", day notes: "d-YYYY-M-D")
  const [notes, setNotes] = useState(() => load('notes', {}))

  const go = useCallback((dy, dm) => {
    setRS(null); setRE(null); setSel(false)
    let ny = dy, nm = dm
    if (nm < 0)  { ny--; nm = 11 }
    if (nm > 11) { ny++; nm = 0  }
    setYear(ny); setMonth(nm)
  }, [])

  const prevMonth = useCallback(() => go(year, month - 1), [year, month, go])
  const nextMonth = useCallback(() => go(year, month + 1), [year, month, go])

  const selectDay = useCallback((day) => {
    if (!selecting || rangeStart === null) {
      setRS(day); setRE(null); setSel(true)
    } else {
      if (day === rangeStart) { setRS(null); setRE(null); setSel(false); return }
      setRE(day); setSel(false)
    }
  }, [selecting, rangeStart])

  const clearRange = useCallback(() => { setRS(null); setRE(null); setSel(false) }, [])

  const saveNote = useCallback((key, text) => {
    setNotes(prev => {
      const next = { ...prev, [key]: text }
      save('notes', next)
      return next
    })
  }, [])

  const { lo, hi } = normaliseRange(rangeStart, rangeEnd)

  return {
    year, month, prevMonth, nextMonth,
    rangeStart, rangeEnd, lo, hi, selecting,
    selectDay, clearRange,
    notes, saveNote,
    monthKey: `m-${year}-${month}`,
    dayKey: (d) => `d-${year}-${month}-${d}`,
  }
}
