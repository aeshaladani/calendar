import React, { useState } from 'react'
import { MONTHS, WATER_GOAL, MEAL_SLOTS } from '../utils/constants'
import s from './DayView.module.css'

const PRIORITY_COLORS = { high: '#e24b4a', normal: 'var(--accent)', low: '#aeaea4' }

function WaterTracker({ count, onAdd, onRemove }) {
  return (
    <div className={s.waterCard}>
      <div className={s.cardHead}>
        <span className={s.cardIcon}>💧</span>
        <span className={s.cardTitle}>Water Intake</span>
        <span className={s.waterCount}>{count}/{WATER_GOAL} glasses</span>
      </div>
      <div className={s.glasses}>
        {Array.from({ length: WATER_GOAL }).map((_, i) => (
          <button key={i}
            className={`${s.glass} ${i < count ? s.glassFilled : ''} anim-pop`}
            style={{ animationDelay: `${i * 0.03}s` }}
            onClick={() => i < count ? onRemove() : onAdd()}
            title={i < count ? 'Remove glass' : 'Add glass'}
            aria-label={`Glass ${i+1}`}>
            <svg viewBox="0 0 24 30" className={s.glassSvg}>
              <path d="M4 2 L6 28 H18 L20 2 Z" fill={i < count ? 'var(--accent)' : 'none'}
                stroke={i < count ? 'var(--accent)' : 'var(--border-strong)'} strokeWidth="1.5" />
              {i < count && <path d="M6 14 L18 14 L18 28 H6 Z" fill="var(--accent-mid)" opacity=".35" />}
            </svg>
          </button>
        ))}
      </div>
      <div className={s.waterBar}>
        <div className={s.waterFill} style={{ width: `${(count/WATER_GOAL)*100}%` }} />
      </div>
      <p className={s.waterMsg}>
        {count === 0 ? "Start your day hydrated!" :
         count < 4  ? "Keep going! 💪" :
         count < 8  ? "Great progress!" : "Goal reached! 🎉"}
      </p>
    </div>
  )
}

function TaskCard({ dateKey, tasks, onAdd, onToggle, onDelete, onPriority, onReorder }) {
  const [input, setInput] = useState('')
  const [dragIdx, setDragIdx] = useState(null)

  const submit = () => { if (input.trim()) { onAdd(dateKey, input); setInput('') } }

  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed='move'; }
  const handleDrop = (e, toIdx) => {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== toIdx) onReorder(dateKey, dragIdx, toIdx)
    setDragIdx(null)
  }

  const sorted = [...tasks].sort((a,b) => {
    const rank = {high:0,normal:1,low:2}
    return rank[a.priority] - rank[b.priority]
  })

  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <span className={s.cardIcon}>✓</span>
        <span className={s.cardTitle}>Tasks</span>
        <span className={s.badge}>{tasks.filter(t=>!t.done).length} left</span>
      </div>

      <div className={s.taskList}>
        {sorted.map((task, idx) => (
          <div key={task.id}
            className={`${s.taskRow} ${task.done?s.taskDone:''} anim-fade-up`}
            style={{ animationDelay: `${idx*0.04}s` }}
            draggable onDragStart={e=>handleDragStart(e,idx)}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>handleDrop(e,idx)}>

            <span className={s.dragHandle}>⋮⋮</span>

            <button className={`${s.checkbox} ${task.done?s.checked:''}`}
              onClick={()=>onToggle(dateKey,task.id)}
              style={{ borderColor: PRIORITY_COLORS[task.priority] }}>
              {task.done && <span className={s.checkmark}>✓</span>}
            </button>

            <span className={`${s.taskLabel} ${task.done?s.strikeThrough:''}`}>
              {task.text}
            </span>

            <select className={s.prioritySelect}
              value={task.priority}
              onChange={e=>onPriority(dateKey,task.id,e.target.value)}
              style={{ color: PRIORITY_COLORS[task.priority] }}>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <button className={s.delBtn} onClick={()=>onDelete(dateKey,task.id)}>×</button>
          </div>
        ))}
      </div>

      <div className={s.addRow}>
        <input className={s.addInput} value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&submit()}
          placeholder="Add a task and press Enter…" />
        <button className={s.addBtn} onClick={submit}>+</button>
      </div>
    </div>
  )
}

function MealCard({ dateKey, meals, onSetMeal }) {
  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <span className={s.cardIcon}>🍽</span>
        <span className={s.cardTitle}>Meals</span>
      </div>
      <div className={s.mealGrid}>
        {MEAL_SLOTS.map(slot => (
          <div key={slot} className={s.mealRow}>
            <span className={s.mealSlot}>{slot}</span>
            <input className={s.mealInput}
              value={meals[slot]||''}
              onChange={e=>onSetMeal(dateKey,slot,e.target.value)}
              placeholder={`What's for ${slot.toLowerCase()}?`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DayView({ year, month, day, tasks, meals, water, notes,
  onAddTask, onToggleTask, onDeleteTask, onSetPriority, onReorderTasks,
  onSetMeal, onAddWater, onRemoveWater, onNoteChange }) {

  const dateKey = `d-${year}-${month}-${day}`
  const dayTasks = tasks[dateKey] || []
  const dayMeals = meals[dateKey] || {}
  const waterCount = water[dateKey] || 0
  const note = notes[dateKey] || ''
  const done = dayTasks.filter(t=>t.done).length
  const pct  = dayTasks.length ? Math.round((done/dayTasks.length)*100) : 0

  return (
    <div className={s.dayView}>
      {/* Date header */}
      <div className={s.dayHeader}>
        <div>
          <p className={s.dayLabel}>{['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(year,month,day).getDay()]}</p>
          <h2 className={s.dayBig}>{day} <span className={s.dayMonth}>{MONTHS[month]} {year}</span></h2>
        </div>
        {dayTasks.length > 0 && (
          <div className={s.progressWrap}>
            <svg viewBox="0 0 36 36" className={s.progressRing}>
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--accent)" strokeWidth="3"
                strokeDasharray={`${pct * 0.942} 94.2`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dasharray .4s ease' }} />
            </svg>
            <span className={s.pct}>{pct}%</span>
          </div>
        )}
      </div>

      <div className={s.cols}>
        <div className={s.mainCol}>
          <TaskCard dateKey={dateKey} tasks={dayTasks}
            onAdd={onAddTask} onToggle={onToggleTask}
            onDelete={onDeleteTask} onPriority={onSetPriority}
            onReorder={onReorderTasks} />

          {/* Daily note */}
          <div className={s.card}>
            <div className={s.cardHead}>
              <span className={s.cardIcon}>📝</span>
              <span className={s.cardTitle}>Daily Note</span>
            </div>
            <textarea className={s.noteArea} value={note}
              onChange={e=>onNoteChange(dateKey,e.target.value)}
              placeholder="Capture thoughts, ideas, reflections…" rows={4} />
          </div>
        </div>

        <div className={s.sideCol}>
          <WaterTracker count={waterCount}
            onAdd={()=>onAddWater(dateKey)}
            onRemove={()=>onRemoveWater(dateKey)} />
          <MealCard dateKey={dateKey} meals={dayMeals} onSetMeal={onSetMeal} />
        </div>
      </div>
    </div>
  )
}
