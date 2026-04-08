export const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
export const getFirstDayOfWeek = (y, m) => (new Date(y, m, 1).getDay() + 6) % 7
export const formatDate = (y, m, d) =>
  `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

export function getHoliday(holidays, month, day) {
  return holidays[`${month+1}-${day}`] || null
}
export function getDayCount(lo, hi) {
  if (lo == null || hi == null) return 1
  return Math.abs(hi - lo) + 1
}
export function normaliseRange(start, end) {
  if (start == null) return { lo: null, hi: null }
  const e = end ?? start
  return { lo: Math.min(start, e), hi: Math.max(start, e) }
}
export function buildCalendarCells(year, month) {
  const total = getDaysInMonth(year, month)
  const firstDow = getFirstDayOfWeek(year, month)
  const cellCount = Math.ceil((firstDow + total) / 7) * 7
  return Array.from({ length: cellCount }, (_, i) => {
    const d = i - firstDow + 1
    return (d >= 1 && d <= total) ? d : null
  })
}

/* Returns array of { date: Date, dayNum: number } for a given ISO week */
export function getWeekDays(year, month, day) {
  const base = new Date(year, month, day)
  const dow = (base.getDay() + 6) % 7     // 0=Mon
  const monday = new Date(base)
  monday.setDate(base.getDate() - dow)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { date: d, dayNum: d.getDate(), month: d.getMonth(), year: d.getFullYear() }
  })
}
