import React, { useState, useEffect } from 'react'
import Spiral from './Spiral'
import HeroSection from './HeroSection'
import Toolbar from './Toolbar'
import ViewTabs from './ViewTabs'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'
import WeekView from './WeekView'
import DayView from './DayView'
import { useCalendar } from '../hooks/useCalendar'
import { useTheme } from '../hooks/useTheme'
import { useTasks } from '../hooks/useTasks'
import { useMeals } from '../hooks/useMeals'
import { useWater } from '../hooks/useWater'
import s from './WallCalendar.module.css'

export default function WallCalendar() {
  const today = new Date()
  const cal = useCalendar(today.getFullYear(), today.getMonth())
  const th  = useTheme()
  const tk  = useTasks()
  const ml  = useMeals()
  const wt  = useWater()

  const [view, setView] = useState('month')        // 'month' | 'week' | 'day'
  const [activeDay, setActiveDay] = useState(today.getDate())
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState('right') // for month slide direction
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const nav = (dir) => {
    setSlideDir(dir)
    setAnimKey(k => k + 1)
    dir === 'prev' ? cal.prevMonth() : cal.nextMonth()
  }

  // When user clicks a day in monthly view, jump to day view
  const handleDayClick = (day) => {
    cal.selectDay(day)
    setActiveDay(day)
  }

  const handleDayDoubleClick = (day) => {
    setActiveDay(day)
    setView('day')
  }

  // Wrap CalendarGrid day select to also capture double-click
  const handleGridSelect = (day) => {
    handleDayClick(day)
  }

  return (
    <div className={s.root}>
      <Toolbar themeIdx={th.themeIdx} setThemeIdx={th.setThemeIdx}
        hasRange={cal.rangeStart !== null} onClear={cal.clearRange} />

      <Spiral />

      <div className={s.card}>
        <HeroSection month={cal.month} year={cal.year}
          onPrev={() => nav('prev')} onNext={() => nav('next')} />

        {/* Tab bar */}
        <div className={s.tabBar}>
          <ViewTabs active={view} onChange={setView} />
          <span className={s.todayBtn} onClick={() => {
            setActiveDay(today.getDate())
            if (cal.year !== today.getFullYear() || cal.month !== today.getMonth()) {
              setAnimKey(k=>k+1)
              // reset to today's month
              const diff = (today.getFullYear() - cal.year)*12 + (today.getMonth() - cal.month)
              for (let i=0;i<Math.abs(diff);i++) diff>0?cal.nextMonth():cal.prevMonth()
            }
          }}>Today</span>
        </div>

        {/* Views */}
        <div key={`${animKey}-${view}`}
          className={`${s.body} ${view==='month'
            ? (slideDir==='prev' ? 'anim-slide-left' : 'anim-slide-right')
            : 'anim-fade-up'}`}>

          {view === 'month' && (
            <div className={s.monthLayout}
              style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 2.2fr' }}>
              <NotesPanel
                month={cal.month} year={cal.year}
                lo={cal.lo} hi={cal.hi}
                rangeStart={cal.rangeStart} rangeEnd={cal.rangeEnd}
                notes={cal.notes} monthKey={cal.monthKey}
                onNoteChange={cal.saveNote}
                dayKey={cal.dayKey} />
              <CalendarGrid
                year={cal.year} month={cal.month}
                lo={cal.lo} hi={cal.hi}
                rangeStart={cal.rangeStart} rangeEnd={cal.rangeEnd}
                notes={cal.notes} tasks={tk.tasks}
                onSelect={handleGridSelect} />
            </div>
          )}

          {view === 'week' && (
            <WeekView
              year={cal.year} month={cal.month} day={activeDay}
              tasks={tk.tasks} meals={ml.meals}
              notes={cal.notes}
              onAddTask={tk.addTask}
              onToggleTask={tk.toggleTask}
              onDeleteTask={tk.deleteTask}
              onMoveTask={tk.moveTask}
              onMoveMeal={ml.moveMeal}
              onNoteChange={cal.saveNote} />
          )}

          {view === 'day' && (
            <DayView
              year={cal.year} month={cal.month} day={activeDay}
              tasks={tk.tasks} meals={ml.meals} water={wt.water}
              notes={cal.notes}
              onAddTask={tk.addTask}
              onToggleTask={tk.toggleTask}
              onDeleteTask={tk.deleteTask}
              onSetPriority={tk.setPriority}
              onReorderTasks={tk.reorderTasks}
              onSetMeal={ml.setMeal}
              onAddWater={wt.addGlass}
              onRemoveWater={wt.removeGlass}
              onNoteChange={cal.saveNote} />
          )}
        </div>

        {/* Day picker strip (bottom, visible on month/week for quick day nav) */}
        {view !== 'day' && (
          <div className={s.dayStrip}>
            {view === 'week' && (
              <p className={s.stripHint}>
                Drag tasks or meals between days in week view · Double-click a day in month to open Day view
              </p>
            )}
            {view === 'month' && (
              <p className={s.stripHint}>
                Click to select · Click range start then end · Double-click for day detail
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
